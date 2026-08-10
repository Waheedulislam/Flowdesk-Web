import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { TaskOverview } from "@/components/dashboard/task-overview";
import { ProjectProgress } from "@/components/dashboard/project-progress";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { NotificationPreview } from "@/components/dashboard/notification-preview";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import {
  dashboardStats,
  dashboardSummary,
  projectProgress,
  recentActivity,
  recentNotifications,
  taskDistribution,
  upcomingTasks,
} from "@/lib/dashboard-data";

/**
 * FlowDesk dashboard (Phase 3).
 * Composed from small, reusable dashboard components and fed by isolated mock
 * data from `@/lib/dashboard-data`. UI only — every backend seam is marked
 * with a `// TODO: Connect ... API` note in the data module and components.
 */
export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        {/* TODO: Connect workspace analytics API (header summary + stats) */}
        <DashboardHeader summary={dashboardSummary} />

        <DashboardSection
          title="Overview"
          description="Key metrics across your workspace."
          hideHeader
        >
          <OverviewStats stats={dashboardStats} />
        </DashboardSection>

        {/* Task distribution + project progress, side by side on desktop. */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TaskOverview distribution={taskDistribution} />
          <ProjectProgress projects={projectProgress} />
        </div>

        {/* Upcoming tasks (wide) + notifications (rail). */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UpcomingTasks tasks={upcomingTasks} />
          </div>
          <NotificationPreview notifications={recentNotifications} />
        </div>

        <ActivityFeed activity={recentActivity} />
      </div>
    </AppShell>
  );
}
