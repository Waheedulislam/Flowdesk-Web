"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { useWorkspace } from "@/context/workspace-context";

/** Workspace selector backed by the authenticated user's real workspace list. */
export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const { workspaces, activeWorkspace, isLoading, error, selectWorkspace } = useWorkspace();
  const [createOpen, setCreateOpen] = React.useState(false);

  if (isLoading && !activeWorkspace) return <div className="h-12 animate-pulse rounded-lg bg-sidebar-accent/50" aria-label="Loading workspaces" />;
  if (error && !activeWorkspace) return <p className={cn("px-2 text-xs text-destructive", collapsed && "sr-only")}>Unable to load workspaces.</p>;
  if (!activeWorkspace) return <><button type="button" onClick={() => setCreateOpen(true)} className={cn("flex w-full items-center gap-2 rounded-lg border border-dashed border-sidebar-border px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent", collapsed && "justify-center px-0")}><Plus className="size-4" /><span className={collapsed ? "sr-only" : ""}>Create workspace</span></button><CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} /></>;

  return <><DropdownMenu><DropdownMenuTrigger aria-label="Switch workspace" className={cn("flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-card/50 p-2 text-left outline-none transition-colors", "hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring", collapsed && "justify-center px-0")}><span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-semibold text-primary">{getInitials(activeWorkspace.name)}</span>{!collapsed && <><span className="flex min-w-0 flex-col"><span className="truncate text-sm font-medium text-sidebar-foreground">{activeWorkspace.name}</span><span className="truncate text-xs text-muted-foreground">{activeWorkspace.role.toLowerCase()}</span></span><ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" /></>}</DropdownMenuTrigger><DropdownMenuContent align="start" className="min-w-64"><DropdownMenuLabel>Workspaces</DropdownMenuLabel>{workspaces.map((workspace) => <DropdownMenuItem key={workspace.id} onClick={() => selectWorkspace(workspace.id)} className="gap-2.5"><span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/12 text-[0.625rem] font-semibold text-primary">{getInitials(workspace.name)}</span><span className="min-w-0 flex-1 truncate font-medium">{workspace.name}</span><Badge variant="secondary">{workspace.role}</Badge>{activeWorkspace.id === workspace.id ? <Check className="size-4 shrink-0 text-primary" /> : null}</DropdownMenuItem>)}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => setCreateOpen(true)} className="text-muted-foreground"><Plus />Create workspace</DropdownMenuItem></DropdownMenuContent></DropdownMenu><CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} /></>;
}
