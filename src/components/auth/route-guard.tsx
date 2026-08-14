"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import type { BackendUserRole } from "@/lib/api/auth.api";

function RedirectingNotice({ destination }: { destination: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6" aria-live="polite">
      <p className="text-sm text-muted-foreground">Redirecting to {destination}…</p>
    </main>
  );
}

/**
 * Single guard for every page within the private `(app)` route group.
 * TODO: Replace this client guard with server-side session protection when the
 * backend provides a server-readable session contract.
 */
export function RequireAuthentication({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  React.useEffect(() => {
    if (isReady && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isReady, router]);

  if (!isReady) return <RedirectingNotice destination="your session" />;
  if (!isAuthenticated) return <RedirectingNotice destination="login" />;
  return <>{children}</>;
}

/** Keeps auth routes out of the way once a session exists. */
export function RedirectAuthenticatedUser({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  React.useEffect(() => {
    if (isReady && isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isReady, router]);

  if (!isReady) return <RedirectingNotice destination="your session" />;
  if (isAuthenticated) return <RedirectingNotice destination="dashboard" />;
  return <>{children}</>;
}

/** Restricts routes using the role returned by the backend current-user API. */
export function RequireRole({ children, roles }: { children: React.ReactNode; roles: readonly BackendUserRole[] }) {
  const router = useRouter();
  const { isReady, user } = useAuth();
  const isAllowed = Boolean(user && roles.includes(user.role));

  React.useEffect(() => {
    if (isReady && !isAllowed) router.replace("/dashboard");
  }, [isAllowed, isReady, router]);

  if (!isReady) return <RedirectingNotice destination="your account" />;
  if (!isAllowed) return <RedirectingNotice destination="dashboard" />;
  return <>{children}</>;
}
