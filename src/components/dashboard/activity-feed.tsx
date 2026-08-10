import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItemData } from "@/lib/dashboard-data";
import { ActivityItem } from "./activity-item";

/**
 * Recent workspace activity as a vertical timeline of ActivityItem rows.
 * Presentational only.
 */

interface ActivityFeedProps {
  activity: ActivityItemData[];
}

function ActivityFeed({ activity }: ActivityFeedProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
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
