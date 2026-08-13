/**
 * Admin routes inherit the authenticated `(app)` layout guard.
 * TODO: Add role-based authorization.
 * TODO: Restrict /admin to SUPER_ADMIN.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
