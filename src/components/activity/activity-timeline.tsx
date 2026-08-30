"use client";

import type { ActivityLog } from "@/lib/api/activity.api";
import { ActivityItem } from "./activity-item";

export function ActivityTimeline({
  activities,
}: {
  activities: ActivityLog[];
}) {
  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

export default ActivityTimeline;
