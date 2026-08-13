"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMockAuth } from "@/context/mock-auth-context";

function RedirectingNotice({ destination }: { destination: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6" aria-live="polite">
      <p className="text-sm text-muted-foreground">Redirecting to {destination}…</p>
    </main>
  );
}

/**
 * Single guard for every page within the private `(app)` route group.
 * TODO: Replace this client guard with server-side session protection in Phase 14.
 */
export function RequireMockAuthentication({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useMockAuth();

  React.useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <RedirectingNotice destination="login" />;
  return <>{children}</>;
}

/** Keeps the login route out of the way once a mock session exists. */
export function RedirectAuthenticatedUser({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useMockAuth();

  React.useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  if (isAuthenticated) return <RedirectingNotice destination="dashboard" />;
  return <>{children}</>;
}
