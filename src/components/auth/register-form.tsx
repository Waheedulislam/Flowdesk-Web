"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { isValidEmail, isValidPassword, messages } from "@/lib/validation";

type Status = "idle" | "loading" | "success";
type Errors = Partial<
  Record<"name" | "email" | "password" | "confirm" | "terms", string>
>;

export function RegisterForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [terms, setTerms] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");

  const loading = status === "loading";
  const done = status === "success";
  const disabled = loading || done;

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = messages.nameRequired;
    if (!email.trim()) next.email = messages.emailRequired;
    else if (!isValidEmail(email)) next.email = messages.emailInvalid;
    if (!password) next.password = messages.passwordRequired;
    else if (!isValidPassword(password)) next.password = messages.passwordWeak;
    if (!confirm) next.confirm = messages.confirmRequired;
    else if (confirm !== password) next.confirm = messages.confirmMismatch;
    if (!terms) next.terms = messages.termsRequired;
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("loading");
    // TODO: Connect register form to the backend auth API.
    //   const res = await register({ name, email, password });
    //   On failure: setStatus("idle"); setFormError(res.message).
    //   On success: send a verification email / redirect to onboarding.
    // The timeout below only demonstrates the loading and success UI and
    // must be removed once the real request is wired up.
    window.setTimeout(() => setStatus("success"), 1100);
  }

  if (done) {
    return (
      <Alert variant="success" title="Account created">
        We&apos;ve sent a verification link to{" "}
        <span className="font-medium">{email}</span>. Confirm your email to
        finish setting up your workspace.
        <div className="mt-3">
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {formError ? (
        <Alert variant="destructive" title="Couldn't create your account">
          {formError}
        </Alert>
      ) : null}

      <FormField id="name" label="Full name" error={errors.name} required>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={name}
          disabled={disabled}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>

      <FormField id="email" label="Work email" error={errors.email} required>
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
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          disabled={disabled}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrength value={password} />
      </FormField>

      <FormField
        id="confirm"
        label="Confirm password"
        error={errors.confirm}
        required
      >
        <PasswordInput
          id="confirm"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirm}
          disabled={disabled}
          aria-invalid={!!errors.confirm}
          aria-describedby={errors.confirm ? "confirm-error" : undefined}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </FormField>

      <div className="flex flex-col gap-1">
        <Checkbox
          checked={terms}
          disabled={disabled}
          aria-invalid={!!errors.terms}
          onChange={(e) => setTerms(e.target.checked)}
          label={
            <span>
              I agree to the{" "}
              {/* TODO: Link to the real Terms of Service page. */}
              <Link href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              {/* TODO: Link to the real Privacy Policy page. */}
              <Link href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          }
        />
        {errors.terms ? (
          <p role="alert" className="text-xs font-medium text-destructive animate-fade-in">
            {errors.terms}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="mt-1 w-full" disabled={disabled}>
        {loading ? (
          <>
            <Spinner />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
