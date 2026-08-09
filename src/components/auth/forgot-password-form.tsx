"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { FormField } from "@/components/ui/form-field";
import { isValidEmail, messages } from "@/lib/validation";

type Status = "idle" | "loading" | "success";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [status, setStatus] = React.useState<Status>("idle");

  const loading = status === "loading";
  const sent = status === "success";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let found: string | undefined;
    if (!email.trim()) found = messages.emailRequired;
    else if (!isValidEmail(email)) found = messages.emailInvalid;
    setError(found);
    if (found) return;

    setStatus("loading");
    // TODO: Connect to the backend "request password reset" endpoint.
    //   await requestPasswordReset({ email });
    // Always show the same confirmation regardless of whether the address
    // exists, to avoid leaking which emails are registered.
    // The timeout below only demonstrates the loading and success UI and
    // must be removed once the real request is wired up.
    window.setTimeout(() => setStatus("success"), 1100);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex size-11 items-center justify-center rounded-full bg-success/12 text-success">
          <MailCheck className="size-5" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Check your inbox
          </h2>
          <p className="text-sm text-muted-foreground">
            If an account exists for{" "}
            <span className="font-medium text-foreground">{email}</span>, we&apos;ve
            sent a link to reset your password. It may take a minute to arrive.
          </p>
        </div>

        <Alert variant="info">
          Didn&apos;t get it? Check your spam folder, or{" "}
          {/* TODO: Re-trigger the reset email request. */}
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="font-medium text-info underline underline-offset-4"
          >
            try another email
          </button>
          .
        </Alert>

        <BackToSignIn />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        id="email"
        label="Email"
        error={error}
        hint="We'll email you a link to reset your password."
        required
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          disabled={loading}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : "email-hint"}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Spinner />
            Sending link…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <BackToSignIn />
    </form>
  );
}

function BackToSignIn() {
  return (
    <Link
      href="/login"
      className="mx-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      <ArrowLeft className="size-4" />
      Back to sign in
    </Link>
  );
}
