"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockWorkspaces } from "@/lib/navigation";
import type { Workspace } from "@/types";

/**
 * Workspace selector shown at the top of the sidebar.
 * Selection is local UI state only — wiring comes later.
 */
export function WorkspaceSwitcher({ collapsed = false }: { collapsed?: boolean }) {
  const [active, setActive] = React.useState<Workspace>(mockWorkspaces[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Switch workspace"
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg border border-sidebar-border bg-card/50 p-2 text-left outline-none transition-colors",
          "hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          collapsed && "justify-center px-0",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-semibold text-primary">
          {getInitials(active.name)}
        </span>
        {!collapsed && (
          <>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {active.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {active.plan} plan
              </span>
            </span>
            <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {mockWorkspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => setActive(ws)}
            className="gap-2.5"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/12 text-[0.625rem] font-semibold text-primary">
              {getInitials(ws.name)}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-medium">{ws.name}</span>
            </span>
            <Badge variant="secondary" className="ml-auto">
              {ws.plan}
            </Badge>
            {active.id === ws.id ? (
              <Check className="size-4 shrink-0 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {/* TODO: Connect to workspace creation flow. */}
        <DropdownMenuItem className="text-muted-foreground">
          <Plus />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
