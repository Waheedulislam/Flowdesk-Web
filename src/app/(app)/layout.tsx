import { AppShell } from "@/components/layout/app-shell";
import { RequireAuthentication } from "@/components/auth/route-guard";
import { WorkspaceProvider } from "@/context/workspace-context";

/**
 * Shared application shell for all authenticated routes: fixed sidebar,
 * sticky navbar, scrollable main content and footer. Auth pages live in the
 * sibling `(auth)` route group and render outside this shell.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireAuthentication>
      <WorkspaceProvider>
        <AppShell>{children}</AppShell>
      </WorkspaceProvider>
    </RequireAuthentication>
  );
}
