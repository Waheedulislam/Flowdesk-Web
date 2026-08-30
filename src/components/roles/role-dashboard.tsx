"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDashed,
  FolderKanban,
  ListChecks,
  Sparkles,
  Users,
} from "lucide-react";

import { RoleBadge } from "@/components/roles/role-badge";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { useActivity } from "@/components/activity/hooks/use-activity";
import { ProjectProgress } from "@/components/dashboard/project-progress";
import { TaskOverview } from "@/components/dashboard/task-overview";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useRole } from "@/context/role-context";
import { useWorkspace } from "@/context/workspace-context";
import { useProjects } from "@/components/projects/hooks/use-projects";
import { useTasks } from "@/components/tasks/hooks/use-tasks";
import { useWorkspaceMembers } from "@/components/workspace/hooks/use-workspace-members";
import { getProjectTaskStatistics } from "@/lib/project-task-statistics";
import type {
  ProjectStatus,
  TaskDistributionSlice,
} from "@/lib/dashboard-data";
import type { ProjectRecord } from "@/lib/api/project.api";
import type { TaskRecord } from "@/lib/api/task.api";

const ACTIVE_PROJECT_STATUSES = new Set(["ACTIVE", "IN_PROGRESS"]);
const statusOrder = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as const;

function formatRelativeDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isDueToday(value: string | null | undefined) {
  if (!value) return false;
  const dueDate = new Date(value);
  if (Number.isNaN(dueDate.getTime())) return false;
  const today = new Date();
  return (
    dueDate.getFullYear() === today.getFullYear() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getDate() === today.getDate()
  );
}

function isOverdue(task: TaskRecord) {
  if (!task.dueDate || task.status === "DONE") return false;
  const due = new Date(task.dueDate);
  if (Number.isNaN(due.getTime())) return false;
  return due.getTime() < Date.now();
}

function mapProjectStatusForProgress(
  status: ProjectRecord["status"],
): ProjectStatus {
  switch (status) {
    case "COMPLETED":
      return "COMPLETED";
    case "ON_HOLD":
      return "DELAYED";
    case "PLANNING":
      return "AT_RISK";
    case "ACTIVE":
    case "IN_PROGRESS":
    default:
      return "ON_TRACK";
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-xl bg-muted/60" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-muted/60"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="h-[300px] animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-[300px] animate-pulse rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
}

export function RoleDashboard() {
  const { user, accessToken, isReady } = useAuth();
  const { role } = useRole();
  const {
    activeWorkspace,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useWorkspace();

  const projectsState = useProjects({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });

  const projectOptions = React.useMemo(
    () =>
      projectsState.data.map((project) => ({
        id: project.id,
        name: project.name,
      })),
    [projectsState.data],
  );

  const taskState = useTasks({
    accessToken,
    isReady,
    projects: projectOptions,
  });

  const membersState = useWorkspaceMembers({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });
  const activityState = useActivity({ limit: 5 });

  const projectStatistics = React.useMemo(() => {
    const map = new Map<string, ReturnType<typeof getProjectTaskStatistics>>();
    projectsState.data.forEach((project) => {
      const projectTasks = taskState.tasks.filter(
        (task) => task.projectId === project.id,
      );
      map.set(project.id, getProjectTaskStatistics(projectTasks));
    });
    return map;
  }, [projectsState.data, taskState.tasks]);

  const dashboardStats = React.useMemo(() => {
    const totalProjects = projectsState.data.length;
    const activeProjects = projectsState.data.filter((project) =>
      ACTIVE_PROJECT_STATUSES.has(project.status),
    ).length;
    const totalTasks = taskState.tasks.length;
    const completedTasks = taskState.tasks.filter(
      (task) => task.status === "DONE",
    ).length;
    const overdueTasks = taskState.tasks.filter((task) =>
      isOverdue(task),
    ).length;
    const dueTodayTasks = taskState.tasks.filter((task) =>
      isDueToday(task.dueDate),
    ).length;
    const todoTasks = taskState.tasks.filter(
      (task) => task.status === "TODO",
    ).length;
    const inProgressTasks = taskState.tasks.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length;
    const inReviewTasks = taskState.tasks.filter(
      (task) => task.status === "IN_REVIEW",
    ).length;
    const doneTasks = taskState.tasks.filter(
      (task) => task.status === "DONE",
    ).length;
    const teamMembers = membersState.members.length;
    const completionRate =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      dueTodayTasks,
      todoTasks,
      inProgressTasks,
      inReviewTasks,
      doneTasks,
      teamMembers,
      completionRate,
    };
  }, [membersState.members.length, projectsState.data, taskState.tasks]);

  const distribution = React.useMemo<TaskDistributionSlice[]>(() => {
    const counts: Record<
      "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "OVERDUE",
      number
    > = {
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      DONE: 0,
      OVERDUE: 0,
    };

    taskState.tasks.forEach((task) => {
      if (task.status === "DONE") {
        counts.DONE += 1;
        return;
      }
      if (task.status === "TODO") counts.TODO += 1;
      if (task.status === "IN_PROGRESS") counts.IN_PROGRESS += 1;
      if (task.status === "IN_REVIEW") counts.IN_REVIEW += 1;
      if (isOverdue(task)) counts.OVERDUE += 1;
    });

    return [
      { key: "TODO", label: "To do", count: counts.TODO, tone: "muted" },
      {
        key: "IN_PROGRESS",
        label: "In progress",
        count: counts.IN_PROGRESS,
        tone: "primary",
      },
      {
        key: "IN_REVIEW",
        label: "In review",
        count: counts.IN_REVIEW,
        tone: "info",
      },
      { key: "DONE", label: "Done", count: counts.DONE, tone: "success" },
      {
        key: "OVERDUE",
        label: "Overdue",
        count: counts.OVERDUE,
        tone: "destructive",
      },
    ];
  }, [taskState.tasks]);

  const recentProjects = React.useMemo(
    () =>
      [...projectsState.data]
        .sort(
          (left, right) =>
            new Date(right.updatedAt).getTime() -
            new Date(left.updatedAt).getTime(),
        )
        .slice(0, 4),
    [projectsState.data],
  );

  const recentTasks = React.useMemo(
    () =>
      [...taskState.tasks]
        .sort(
          (left, right) =>
            new Date(right.updatedAt).getTime() -
            new Date(left.updatedAt).getTime(),
        )
        .slice(0, 5),
    [taskState.tasks],
  );

  const upcomingTasks = React.useMemo(
    () =>
      [...taskState.tasks]
        .filter((task) => task.dueDate && task.status !== "DONE")
        .sort(
          (left, right) =>
            new Date(left.dueDate ?? 0).getTime() -
            new Date(right.dueDate ?? 0).getTime(),
        )
        .slice(0, 4),
    [taskState.tasks],
  );

  const projectLookup = React.useMemo(
    () =>
      Object.fromEntries(
        projectsState.data.map((project) => [project.id, project.name]),
      ),
    [projectsState.data],
  );

  const assigneeLookup = React.useMemo(
    () =>
      Object.fromEntries(
        membersState.members.map((member) => [member.userId, member.user.name]),
      ),
    [membersState.members],
  );

  const projectProgressItems = React.useMemo(
    () =>
      projectsState.data.map((project) => {
        const stats = projectStatistics.get(project.id) ?? {
          totalTasks: 0,
          completedTasks: 0,
          progress: 0,
        };

        return {
          id: project.id,
          name: project.name,
          progress: stats.progress,
          totalTasks: stats.totalTasks,
          completedTasks: stats.completedTasks,
          status: mapProjectStatusForProgress(project.status),
        };
      }),
    [projectStatistics, projectsState.data],
  );

  const kpiCards = [
    {
      label: "Total Projects",
      value: dashboardStats.totalProjects,
      icon: FolderKanban,
      tone: "primary",
    },
    {
      label: "Active Projects",
      value: dashboardStats.activeProjects,
      icon: BarChart3,
      tone: "info",
    },
    {
      label: "Total Tasks",
      value: dashboardStats.totalTasks,
      icon: ListChecks,
      tone: "warning",
    },
    {
      label: "Completed",
      value: dashboardStats.completedTasks,
      icon: CheckCircle2,
      tone: "success",
    },
    {
      label: "Team Members",
      value: dashboardStats.teamMembers,
      icon: Users,
      tone: "muted",
    },
    {
      label: "Completion Rate",
      value: `${dashboardStats.completionRate}%`,
      icon: Activity,
      tone: "primary",
    },
  ];

  if (!user || !role || !isReady || workspaceLoading) {
    return <DashboardSkeleton />;
  }

  if (!activeWorkspace) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CircleDashed className="mx-auto size-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">
              No workspace selected
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a workspace to view projects, tasks, and team activity.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasTaskData = taskState.tasks.length > 0;
  const hasProjectData = projectsState.data.length > 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Dashboard
              </p>
              <RoleBadge role={role} />
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Good to see you, {user.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {role === "SYSTEM_ADMIN"
                ? "Platform-wide analytics are unavailable from the current workspace APIs; workspace metrics below reflect the active workspace."
                : `Workspace overview for ${activeWorkspace.name}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{activeWorkspace.name}</Badge>
            <Link
              href="/projects"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View projects
            </Link>
            <Link href="/tasks" className={buttonVariants({ size: "sm" })}>
              Open tasks
            </Link>
          </div>
        </div>
      </header>

      {workspaceError ||
      projectsState.error ||
      taskState.error ||
      membersState.error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Dashboard data could not be loaded
                </p>
                <p className="text-sm text-muted-foreground">
                  {workspaceError ??
                    projectsState.error ??
                    taskState.error ??
                    membersState.error}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void projectsState.reload();
                void taskState.reload();
                void membersState.reload();
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {role === "SYSTEM_ADMIN" ? (
        <Card className="border-dashed border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="text-sm font-semibold">
                  Platform-wide totals are unavailable
                </p>
                <p className="text-sm text-muted-foreground">
                  The current backend exposes workspace-scoped project, task,
                  and member APIs. The dashboard below uses the active workspace
                  only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpiCards.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="transition-shadow hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span
                  className={[
                    "flex size-9 items-center justify-center rounded-lg",
                    tone === "primary" && "bg-primary/10 text-primary",
                    tone === "info" && "bg-sky-500/10 text-sky-500",
                    tone === "warning" && "bg-amber-500/10 text-amber-500",
                    tone === "success" && "bg-emerald-500/10 text-emerald-500",
                    tone === "muted" && "bg-muted text-foreground",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                {value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {label === "Completion Rate"
                  ? `${dashboardStats.completedTasks} of ${dashboardStats.totalTasks} tasks complete`
                  : label === "Team Members"
                    ? `${dashboardStats.teamMembers} workspace members`
                    : label === "Active Projects"
                      ? `${dashboardStats.activeProjects} currently active`
                      : label === "Total Tasks"
                        ? `${dashboardStats.todoTasks} to do, ${dashboardStats.inProgressTasks} in progress`
                        : label === "Completed"
                          ? `${dashboardStats.doneTasks} finished`
                          : `${dashboardStats.totalProjects} total projects`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActivityFeed
        activities={activityState.data}
        loading={activityState.loading}
        error={activityState.error}
        compact
        action={
          <Link
            href="/activity"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="h-full">
          <CardHeader className="flex items-center justify-between gap-3 pb-3">
            <CardTitle>Task distribution</CardTitle>
            <Badge variant="secondary">{dashboardStats.totalTasks} tasks</Badge>
          </CardHeader>
          <CardContent>
            {taskState.loading ? (
              <div className="h-[260px] animate-pulse rounded-xl bg-muted/60" />
            ) : !hasTaskData ? (
              <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
                No tasks yet for this workspace.
              </div>
            ) : (
              <TaskOverview distribution={distribution} />
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle>Workspace snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">To do</p>
                <p className="mt-2 text-xl font-semibold tabular-nums">
                  {dashboardStats.todoTasks}
                </p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">In progress</p>
                <p className="mt-2 text-xl font-semibold tabular-nums">
                  {dashboardStats.inProgressTasks}
                </p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">In review</p>
                <p className="mt-2 text-xl font-semibold tabular-nums">
                  {dashboardStats.inReviewTasks}
                </p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Due today</p>
                <p className="mt-2 text-xl font-semibold tabular-nums">
                  {dashboardStats.dueTodayTasks}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">Overdue</p>
                <Badge
                  variant={
                    dashboardStats.overdueTasks > 0
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {dashboardStats.overdueTasks}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Tasks with a due date before now and a non-completed status.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between gap-4 pb-3">
          <CardTitle>Project progress</CardTitle>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {projectsState.loading ? (
            <div className="h-[220px] animate-pulse rounded-xl bg-muted/60" />
          ) : !hasProjectData ? (
            <div className="flex min-h-[180px] items-center justify-center text-sm text-muted-foreground">
              No projects yet. Create your first project to start tracking
              delivery.
            </div>
          ) : (
            <ProjectProgress projects={projectProgressItems} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="flex items-center justify-between gap-3 pb-3">
            <CardTitle>Recent projects</CardTitle>
            <Link
              href="/projects"
              className="text-sm text-primary hover:underline"
            >
              Open
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectsState.loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-lg bg-muted/60"
                  />
                ))}
              </div>
            ) : recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent projects available.
              </p>
            ) : (
              recentProjects.map((project) => {
                const stats = projectStatistics.get(project.id) ?? {
                  totalTasks: 0,
                  completedTasks: 0,
                  progress: 0,
                };
                return (
                  <div key={project.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {formatRelativeDate(project.updatedAt)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          project.status === "COMPLETED"
                            ? "success"
                            : project.status === "ON_HOLD"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {stats.completedTasks}/{stats.totalTasks} tasks
                      </span>
                      <span className="font-medium text-foreground">
                        {stats.progress}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex items-center justify-between gap-3 pb-3">
            <CardTitle>Recent tasks</CardTitle>
            <Link
              href="/tasks"
              className="text-sm text-primary hover:underline"
            >
              Open
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {taskState.loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-lg bg-muted/60"
                  />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No task activity available.
              </p>
            ) : (
              recentTasks.map((task) => {
                const statusTone =
                  task.status === "DONE"
                    ? "success"
                    : task.status === "IN_PROGRESS"
                      ? "primary"
                      : task.status === "IN_REVIEW"
                        ? "info"
                        : "muted";

                const projectName =
                  projectLookup[task.projectId] ?? "Unknown project";
                const assigneeName =
                  task.assignee?.name ??
                  assigneeLookup[task.assignedTo ?? ""] ??
                  "Unassigned";

                return (
                  <div key={task.id} className="rounded-xl border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {projectName}
                        </p>
                      </div>
                      <Badge
                        variant={
                          statusTone === "success"
                            ? "success"
                            : statusTone === "primary"
                              ? "default"
                              : statusTone === "info"
                                ? "info"
                                : "secondary"
                        }
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{task.priority}</span>
                      <span>•</span>
                      <span>{assigneeName}</span>
                      <span>•</span>
                      <span>{formatRelativeDate(task.updatedAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Upcoming due</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming due dates for this workspace.
              </p>
            ) : (
              upcomingTasks.map((task) => {
                const dueLabel = task.dueDate
                  ? formatRelativeDate(task.dueDate)
                  : "No due date";
                const projectName =
                  projectLookup[task.projectId] ?? "Unknown project";
                const assigneeName =
                  task.assignee?.name ??
                  assigneeLookup[task.assignedTo ?? ""] ??
                  "Unassigned";
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 rounded-xl border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {projectName} • {assigneeName}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          task.status === "DONE" ? "success" : "secondary"
                        }
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {dueLabel}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Link
              href="/projects"
              className={
                buttonVariants({ variant: "outline" }) +
                " w-full justify-between"
              }
            >
              <span className="inline-flex items-center gap-2">
                <FolderKanban className="size-4" /> Create project
              </span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/tasks"
              className={
                buttonVariants({ variant: "outline" }) +
                " w-full justify-between"
              }
            >
              <span className="inline-flex items-center gap-2">
                <ListChecks className="size-4" /> View tasks
              </span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/workspace"
              className={
                buttonVariants({ variant: "outline" }) +
                " w-full justify-between"
              }
            >
              <span className="inline-flex items-center gap-2">
                <Users className="size-4" /> Team overview
              </span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/analytics"
              className={
                buttonVariants({ variant: "outline" }) +
                " w-full justify-between"
              }
            >
              <span className="inline-flex items-center gap-2">
                <BarChart3 className="size-4" /> Analytics
              </span>
              <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border bg-card/60 p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Workflow health
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              Task pipeline
            </h3>
          </div>
          <Badge variant="secondary">{dashboardStats.totalTasks} total</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusOrder.map((status) => {
            const count =
              status === "DONE"
                ? dashboardStats.doneTasks
                : status === "IN_PROGRESS"
                  ? dashboardStats.inProgressTasks
                  : status === "IN_REVIEW"
                    ? dashboardStats.inReviewTasks
                    : dashboardStats.todoTasks;

            const meta = {
              TODO: {
                title: "To do",
                accent: "bg-slate-500",
                soft: "bg-slate-500/10 text-slate-700 dark:text-slate-200",
                description: "Queued for the next sprint",
              },
              IN_PROGRESS: {
                title: "In progress",
                accent: "bg-blue-500",
                soft: "bg-blue-500/10 text-blue-700 dark:text-blue-200",
                description: "Currently moving forward",
              },
              IN_REVIEW: {
                title: "In review",
                accent: "bg-amber-500",
                soft: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
                description: "Waiting for approval",
              },
              DONE: {
                title: "Done",
                accent: "bg-emerald-500",
                soft: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
                description: "Completed and closed",
              },
            }[status];

            const percent =
              dashboardStats.totalTasks === 0
                ? 0
                : Math.max(6, (count / dashboardStats.totalTasks) * 100);

            return (
              <div
                key={status}
                className="rounded-2xl border border-border/80 bg-gradient-to-br from-background to-muted/20 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${meta.soft}`}
                  >
                    <span className={`size-2 rounded-full ${meta.accent}`} />
                    {meta.title}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(percent)}%
                  </span>
                </div>

                <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
                  {count}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {meta.description}
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${meta.accent}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(role !== "SYSTEM_ADMIN" && membersState.loading) ||
      (role !== "SYSTEM_ADMIN" && projectsState.loading) ? (
        <div className="text-xs text-muted-foreground">
          Refreshing workspace metrics…
        </div>
      ) : null}
    </div>
  );
}
