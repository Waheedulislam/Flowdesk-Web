"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { FormField } from "@/components/ui/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { isValidPassword, messages } from "@/lib/validation";

type Status = "idle" | "loading" | "success";
type Errors = Partial<Record<"password" | "confirm", string>>;

export function ResetPasswordForm() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");

  const loading = status === "loading";
  const done = status === "success";
  const disabled = loading || done;

  function validate(): Errors {
    const next: Errors = {};
    if (!password) next.password = messages.passwordRequired;
    else if (!isValidPassword(password)) next.password = messages.passwordWeak;
    if (!confirm) next.confirm = messages.confirmRequired;
    else if (confirm !== password) next.confirm = messages.confirmMismatch;
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
    // TODO: Connect to the backend "reset password" endpoint.
    //   Read the reset token from the URL (e.g. useSearchParams) and send it
    //   alongside the new password: await resetPassword({ token, password });
    //   On failure (expired/invalid token): setStatus("idle"); setFormError(...).
    // The timeout below only demonstrates the loading and success UI and
    // must be removed once the real request is wired up.
    window.setTimeout(() => setStatus("success"), 1100);
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <Alert variant="success" title="Password updated">
          Your password has been changed. You can now sign in with your new
          password.
        </Alert>
        <Link href="/login" className={cn(buttonVariants(), "w-full")}>
          Continue to sign in
          <ArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {formError ? (
        <Alert variant="destructive" title="Couldn't update your password">
          {formError}
        </Alert>
      ) : null}

      <FormField
        id="password"
        label="New password"
        error={errors.password}
        required
      >
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a new password"
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
        label="Confirm new password"
        error={errors.confirm}
        required
      >
        <PasswordInput
          id="confirm"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          value={confirm}
          disabled={disabled}
          aria-invalid={!!errors.confirm}
          aria-describedby={errors.confirm ? "confirm-error" : undefined}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </FormField>

      <Button type="submit" className="mt-1 w-full" disabled={disabled}>
        {loading ? (
          <>
            <Spinner />
            Updating password…
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
