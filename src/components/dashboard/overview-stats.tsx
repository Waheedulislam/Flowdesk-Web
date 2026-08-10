import { StatCard } from "./stat-card";
import type { DashboardStat } from "@/lib/dashboard-data";

/**
 * Responsive grid of overview metrics.
 * Mobile: single column. Tablet (sm): two columns. Desktop (xl): four columns.
 */

interface OverviewStatsProps {
  stats: DashboardStat[];
}

function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

export { OverviewStats };
