"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, FolderPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/dashboard-data";
import { useAuth } from "@/context/auth-context";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { useWorkspace } from "@/context/workspace-context";

/**
 * Dashboard header: greeting + productivity summary, a workspace selector, a
 * time-range toggle, and the primary action. All interactivity is local UI
 * state only (no data fetching) — hence the `"use client"` boundary.
 */

const PERIODS = ["This week", "This month", "This quarter"] as const;
type Period = (typeof PERIODS)[number];

interface DashboardHeaderProps {
  summary: DashboardSummary;
}

function DashboardHeader({ summary }: DashboardHeaderProps) {
  const { user } = useAuth();
  const { workspaces, activeWorkspace, isLoading: isWorkspacesLoading, selectWorkspace } = useWorkspace();
  const [createOpen, setCreateOpen] = React.useState(false);
  // TODO: Refetch dashboard analytics when the selected period changes.
  const [period, setPeriod] = React.useState<Period>("This week");

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Good to see you{user?.name ? `, ${user.name}` : ""}
          </h1>
          {activeWorkspace ? <Badge variant="secondary">{activeWorkspace.name}</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          {summary.headline}{" "}
          <span className="text-foreground">
            {summary.dueToday} tasks due today.
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* TODO: Persist the selected workspace when the backend exposes a current-workspace endpoint. */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Switch workspace"
            disabled={isWorkspacesLoading}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/12 text-[0.625rem] font-semibold text-primary">
              {activeWorkspace ? getInitials(activeWorkspace.name) : "?"}
            </span>
            <span className="max-w-32 truncate font-medium">{activeWorkspace?.name ?? (isWorkspacesLoading ? "Loadingâ€¦" : "No workspace")}</span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => selectWorkspace(workspace.id)}
                className="gap-2.5"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded bg-primary/12 text-[0.625rem] font-semibold text-primary">
                  {getInitials(workspace.name)}
                </span>
                <span className="truncate font-medium">{workspace.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {workspace.role}
                </Badge>
                {activeWorkspace?.id === workspace.id ? (
                  <Check className="size-4 shrink-0 text-primary" />
                ) : null}
              </DropdownMenuItem>
            ))}
            {!isWorkspacesLoading && workspaces.length === 0 ? <DropdownMenuItem disabled>No workspaces yet</DropdownMenuItem> : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground" onClick={() => setCreateOpen(true)}>
              <Plus />
              Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Time-range toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Change time range"
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <span className="font-medium">{period}</span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {PERIODS.map((option) => (
              <DropdownMenuItem key={option} onClick={() => setPeriod(option)}>
                <span className="flex-1">{option}</span>
                {period === option ? (
                  <Check className="size-4 shrink-0 text-primary" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* TODO: Connect to project creation flow. */}
        <Button>
          <FolderPlus />
          New project
        </Button>
      </div>
      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

export { DashboardHeader };
