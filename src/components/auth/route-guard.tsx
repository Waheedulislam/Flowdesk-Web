"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

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
