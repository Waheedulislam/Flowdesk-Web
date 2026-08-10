import { Activity } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkspaceActivityItem } from "@/lib/workspace-data";

interface WorkspaceOverviewProps {
  activity: WorkspaceActivityItem[];
}

export function WorkspaceOverview({ activity }: WorkspaceOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-4" />
          Recent workspace activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activity.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border/80 bg-background/70 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{item.title}</p>
              <Badge variant="secondary">{item.time}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
              {item.actor}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
