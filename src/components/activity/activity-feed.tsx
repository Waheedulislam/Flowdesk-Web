import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityLog } from "@/lib/api/activity.api";
import { ActivityItem } from "./activity-item";
import { ActivitySkeleton } from "./activity-skeleton";

export function ActivityFeed({
  activities,
  title = "Recent Activity",
  action,
  loading = false,
  error,
  compact = false,
  emptyMessage = "No activity yet for this workspace.",
  actorRoles,
  projectNames,
}: {
  activities: ActivityLog[];
  title?: string;
  action?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  compact?: boolean;
  emptyMessage?: string;
  actorRoles?: Record<string, string>;
  projectNames?: Record<string, string>;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>{title}</CardTitle>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className={compact ? "pt-0" : undefined}>
        {loading ? (
          <ActivitySkeleton rows={compact ? 3 : 5} />
        ) : error ? (
          <div className="flex min-h-32 items-center justify-center text-center text-sm text-destructive">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <ul className={compact ? "space-y-2" : "space-y-3"}>
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                compact={compact}
                actorRole={actorRoles?.[activity.actor.id]}
                projectName={projectNames?.[activity.id]}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
