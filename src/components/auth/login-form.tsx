"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { isValidEmail, messages } from "@/lib/validation";
import { useAuth } from "@/context/auth-context";
import { loginUser } from "@/lib/api/auth.api";

type Status = "idle" | "loading" | "success";
type Errors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const router = useRouter();
  const { completeSignIn } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");

  const loading = status === "loading";
  const done = status === "success";
  const disabled = loading || done;

  function validate(): Errors {
    const next: Errors = {};
    if (!email.trim()) next.email = messages.emailRequired;
    else if (!isValidEmail(email)) next.email = messages.emailInvalid;
    if (!password) next.password = messages.passwordRequired;
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("loading");

    try {
      const response = await loginUser({ email: email.trim(), password });
      completeSignIn(response.data.accessToken);
      setStatus("success");
      router.replace("/dashboard");
    } catch (error) {
      setStatus("idle");
      setFormError(
        error instanceof Error
          ? error.message
          : "We couldn't sign you in. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {formError ? (
        <Alert variant="destructive" title="Couldn't sign you in">
          {formError}
        </Alert>
      ) : null}
      {done ? (
        <Alert variant="success" title="Signed in">
          Taking you to your dashboard…
        </Alert>
      ) : null}

      <FormField id="email" label="Email" error={errors.email} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          disabled={disabled}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={errors.password}
        required
        labelAction={
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        }
      >
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          disabled={disabled}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      <Checkbox
        checked={remember}
        disabled={disabled}
        onChange={(e) => setRemember(e.target.checked)}
        label="Remember me for 30 days"
      />

      <Button type="submit" className="mt-1 w-full" disabled={disabled}>
        {loading ? (
          <>
            <Spinner />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
