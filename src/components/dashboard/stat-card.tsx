import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStat, TrendDirection } from "@/lib/dashboard-data";
import { toneChip } from "./tone-styles";

/**
 * A single overview metric: icon chip, big value, label, supporting hint, and
 * an optional trend indicator. Presentational — all data comes from props.
 */

const trendMeta: Record<
  TrendDirection,
  { icon: typeof TrendingUp; className: string }
> = {
  up: { icon: TrendingUp, className: "text-success" },
  down: { icon: TrendingDown, className: "text-destructive" },
  flat: { icon: ArrowRight, className: "text-muted-foreground" },
};

interface StatCardProps {
  stat: DashboardStat;
}

function StatCard({ stat }: StatCardProps) {
  const { label, value, hint, icon: Icon, tone, trend } = stat;
  const TrendIcon = trend ? trendMeta[trend.direction].icon : null;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg",
              toneChip[tone],
            )}
          >
            <Icon className="size-4.5" aria-hidden />
          </span>
          {trend && TrendIcon ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                trendMeta[trend.direction].className,
              )}
            >
              <TrendIcon className="size-3.5" aria-hidden />
              {trend.label}
            </span>
          ) : null}
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </p>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export { StatCard };
