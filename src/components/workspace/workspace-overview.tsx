import { ActivityFeed } from "@/components/activity/activity-feed";
import type { ActivityLog } from "@/lib/api/activity.api";

/** Legacy presentation-only shape used by unrendered workspace fixture components. */
export type WorkspaceOverviewModel = {
  name: string;
  description: string;
  status: string;
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
  projectCount: number;
};

interface WorkspaceOverviewProps {
  activities: ActivityLog[];
  loading?: boolean;
  error?: string | null;
}

export function WorkspaceOverview({
  activities,
  loading,
  error,
}: WorkspaceOverviewProps) {
  return (
    <ActivityFeed
      title="Recent workspace activity"
      activities={activities}
      loading={loading}
      error={error}
      compact
    />
  );
}
