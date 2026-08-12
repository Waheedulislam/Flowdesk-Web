import { AppShell } from "@/components/layout/app-shell";

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
  return <AppShell>{children}</AppShell>;
}
