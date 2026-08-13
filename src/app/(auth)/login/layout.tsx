import { RedirectAuthenticatedUser } from "@/components/auth/route-guard";

/** Login is public until a session exists, then returns the user to the dashboard. */
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <RedirectAuthenticatedUser>{children}</RedirectAuthenticatedUser>;
}
