import { RequireRole } from "@/components/auth/route-guard";

/** Admin routes use the role returned by `GET /api/v1/users/me`. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireRole roles={["SYSTEM_ADMIN", "ADMIN"]}>{children}</RequireRole>;
}
