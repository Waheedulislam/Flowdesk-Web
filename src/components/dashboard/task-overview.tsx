import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TaskDistributionSlice } from "@/lib/dashboard-data";
import { DonutChart, type DonutSegment } from "./donut-chart";
import { toneDot } from "./tone-styles";

/**
 * Task distribution across statuses (To Do / In Progress / In Review / Done /
 * Overdue), shown as a donut with a labelled legend. Presentational only.
 */

interface TaskOverviewProps {
  distribution: TaskDistributionSlice[];
}

function TaskOverview({ distribution }: TaskOverviewProps) {
  const total = distribution.reduce((sum, slice) => sum + slice.count, 0);
  const segments: DonutSegment[] = distribution.map((slice) => ({
    key: slice.key,
    value: slice.count,
    tone: slice.tone,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Task Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <DonutChart
          segments={segments}
          centerValue={total.toLocaleString()}
          centerLabel="tasks"
        />
        <ul className="grid w-full flex-1 grid-cols-2 gap-3 sm:grid-cols-1">
          {distribution.map((slice) => {
            const pct = total ? Math.round((slice.count / total) * 100) : 0;
            return (
              <li key={slice.key} className="flex items-center gap-3">
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", toneDot[slice.tone])}
                  aria-hidden
                />
                <span className="flex-1 text-sm text-foreground">{slice.label}</span>
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {slice.count}
                </span>
                <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

export { TaskOverview };
