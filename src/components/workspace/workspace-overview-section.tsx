"use client";

import { useActivity } from "@/components/activity/hooks/use-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceOverview as WorkspaceActivityPanel } from "@/components/workspace/workspace-overview";
import { WorkspaceStats } from "@/components/workspace/workspace-stats";
import { workspaceStats } from "@/lib/workspace-data";
import type {
  Workspace,
  WorkspaceDetail,
  WorkspaceMemberRecord,
} from "@/lib/api/workspace.api";

export function WorkspaceOverviewSection({
  workspace,
  detail,
  members,
}: {
  workspace: Workspace;
  detail: WorkspaceDetail | null;
  members: WorkspaceMemberRecord[];
}) {
  const activity = useActivity({ limit: 5 });
  const rows = [
    ["Workspace", workspace.name],
    ["Status", workspace.status],
    ["Your role", workspace.role],
    ["Owner", detail?.owner.name ?? "Workspace Owner"],
    ["Member count", String(members.length)],
    ["Projects", "0"],
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
        <WorkspaceStats stats={workspaceStats} />
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
