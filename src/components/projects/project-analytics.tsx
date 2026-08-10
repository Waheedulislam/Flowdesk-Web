import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ProjectAnalyticsMetric } from "@/lib/projects-data";

interface ProjectAnalyticsProps {
  metrics: ProjectAnalyticsMetric[];
}

export function ProjectAnalytics({ metrics }: ProjectAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border/70 bg-background/70 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion rate</span>
            <span className="font-semibold">78%</span>
          </div>
          <Progress value={78} tone="success" className="mt-3" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-lg border border-border/70 bg-background/70 p-3"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="size-4" />
                  {metric.label}
                </div>
                <p className="mt-2 text-xl font-semibold">{metric.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {metric.hint}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
