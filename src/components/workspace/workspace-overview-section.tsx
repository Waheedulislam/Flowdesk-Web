"use client";

import { Briefcase, ShieldCheck, Users } from "lucide-react";

import { useActivity } from "@/components/activity/hooks/use-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceOverview as WorkspaceActivityPanel } from "@/components/workspace/workspace-overview";
import { WorkspaceStats } from "@/components/workspace/workspace-stats";
import type { WorkspaceAnalytics } from "@/lib/api/analytics.api";
import type { ProjectRecord } from "@/lib/api/project.api";
import type {
  Workspace,
  WorkspaceDetail,
  WorkspaceMemberRecord,
} from "@/lib/api/workspace.api";
import type { WorkspaceStatsItem } from "@/lib/workspace-data";

export function WorkspaceOverviewSection({
  workspace,
  detail,
  members,
  projects,
  analytics,
  membersLoading,
  projectsLoading,
  analyticsLoading,
  analyticsError,
}: {
  workspace: Workspace;
  detail: WorkspaceDetail | null;
  members: WorkspaceMemberRecord[];
  projects: ProjectRecord[];
  analytics: WorkspaceAnalytics;
  membersLoading: boolean;
  projectsLoading: boolean;
  analyticsLoading: boolean;
  analyticsError: string | null;
}) {
  const activity = useActivity({ limit: 5 });
  const stats: WorkspaceStatsItem[] = [
    {
      title: "Members",
      value: String(members.length),
      detail: membersLoading
        ? "Loading members..."
        : members.length === 0
          ? "No members yet"
          : "Current member count",
      icon: Users,
    },
    {
      title: "Projects",
      value: String(projects.length),
      detail: projectsLoading
        ? "Loading projects..."
        : projects.length === 0
          ? "No projects yet"
          : "Current project count",
      icon: Briefcase,
    },
    {
      title: "Health",
      value: analyticsLoading
        ? "—"
        : analyticsError
          ? "N/A"
          : `${analytics.completionRate}%`,
      detail: analyticsLoading
        ? "Loading health..."
        : analyticsError
          ? "Completion rate unavailable"
          : "Current workspace completion rate",
      icon: ShieldCheck,
    },
  ];
  const rows = [
    ["Workspace", workspace.name],
    ["Status", workspace.status],
    ["Your role", workspace.role],
    ["Owner", detail?.owner.name ?? "Unavailable"],
    ["Member count", String(members.length)],
    ["Projects", String(projects.length)],
  ];
  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-6">
        <WorkspaceActivityPanel
          activities={activity.data}
          loading={activity.loading}
          error={activity.error}
        />
      </div>
      <div className="space-y-6">
        <WorkspaceStats stats={stats} />
        <Card>
          <CardHeader>
            <CardTitle>Workspace overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="flex min-w-0 items-center justify-between gap-4 rounded-lg border border-border/70 bg-background/70 p-3"
              >
                <span>{label}</span>
                <span className="truncate font-medium text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
