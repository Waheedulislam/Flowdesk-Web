import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkspaceStatsItem } from "@/lib/workspace-data";

interface WorkspaceStatsProps {
  stats: WorkspaceStatsItem[];
}

export function WorkspaceStats({ stats }: WorkspaceStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="size-4" />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.detail}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
