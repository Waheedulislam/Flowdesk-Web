import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItemData } from "@/lib/dashboard-data";
import { ActivityItem } from "./activity-item";

/**
 * Recent workspace activity as a vertical timeline of ActivityItem rows.
 * Presentational only.
 */

interface ActivityFeedProps {
  activity: ActivityItemData[];
  action?: React.ReactNode;
}

function ActivityFeed({ activity, action }: ActivityFeedProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>Recent Activity</CardTitle>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent>
        <ul className="space-y-5">
          {activity.map((item) => (
            <ActivityItem key={item.id} activity={item} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export { ActivityFeed };
