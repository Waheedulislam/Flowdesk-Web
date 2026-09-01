"use client";

import * as React from "react";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import TaskTrendChart from "@/components/analytics/task-trend-chart";
import TaskDistributionChart, {
  type TaskDistributionData,
} from "@/components/analytics/task-distribution-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceAnalytics } from "@/components/analytics/hooks/use-workspace-analytics";
import { useWorkspace } from "@/context/workspace-context";

export default function AnalyticsPage() {
  const analytics = useWorkspaceAnalytics();
  const { activeWorkspace } = useWorkspace();
  const stats = analytics.workspace;
  const distribution: TaskDistributionData = {
    TODO: stats.todoTasks,
    IN_PROGRESS: stats.inProgressTasks,
    IN_REVIEW: Math.max(
      0,
      stats.totalTasks -
        stats.todoTasks -
        stats.inProgressTasks -
        stats.completedTasks,
    ),
    DONE: stats.completedTasks,
    OVERDUE: stats.overdueTasks,
  };

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        workspaceName={activeWorkspace?.name}
        loading={analytics.loading}
        onRefresh={() => void analytics.reload()}
      />

      {analytics.error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">{analytics.error}</p>
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm"
              onClick={() => void analytics.reload()}
            >
              Retry
            </button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ["Total Projects", stats.totalProjects, "Projects in this workspace"],
          ["Total Tasks", stats.totalTasks, "Tasks across all projects"],
          [
            "Completed Tasks",
            stats.completedTasks,
            `${stats.completionRate}% completion rate`,
          ],
          [
            "Overdue Tasks",
            stats.overdueTasks,
            "Open tasks past their due date",
          ],
        ].map(([label, value, hint]) => (
          <Card
            key={String(label)}
            className="transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-sm font-semibold">{label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-5">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {analytics.loading ? "..." : value}
              </p>
              <p className="text-sm text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TaskTrendChart />
        </div>
        <TaskDistributionChart
          data={analytics.loading || analytics.error ? null : distribution}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.loading ? (
              <p className="text-sm text-muted-foreground">
                Loading project analytics...
              </p>
            ) : analytics.projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No project analytics available.
              </p>
            ) : (
              analytics.projects.map((project) => (
                <div key={project.projectId} className="space-y-2">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate">{project.projectName}</span>
                    <span className="font-medium">
                      {project.completionRate}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${project.completionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {project.completedTasks} of {project.totalTasks} tasks
                    complete
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Member productivity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.loading ? (
              <p className="text-sm text-muted-foreground">
                Loading member analytics...
              </p>
            ) : analytics.members.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No member analytics available.
              </p>
            ) : (
              analytics.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between gap-3 rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {member.completionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.totalTasks} tasks
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
