import { RoleDashboard } from "@/components/roles/role-dashboard";

/**
 * FlowDesk dashboard (Phase 3).
 * Composed from small, reusable dashboard components and fed by isolated mock
 * data from `@/lib/dashboard-data`. UI only — every backend seam is marked
 * with a `// TODO: Connect ... API` note in the data module and components.
 */
export default function DashboardPage() {
  return <RoleDashboard />;
}
