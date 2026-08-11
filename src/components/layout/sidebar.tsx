"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { BrandMark } from "@/components/layout/brand-mark";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { getNavigationForRole, secondaryNav } from "@/lib/navigation";
import { useRole } from "@/context/role-context";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Desktop sidebar (hidden below lg). Collapses to an icon rail with tooltips.
 * Uses sidebar-specific tokens so it reads as a distinct surface in both themes.
 */
export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { role } = useRole();
  return (
    <aside
      data-collapsed={collapsed}
      className={cn(
        "hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out lg:flex lg:flex-col",
        collapsed ? "lg:w-[4.5rem]" : "lg:w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <BrandMark collapsed={collapsed} />
      </div>

      <div className={cn("p-3", collapsed && "px-2")}>
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin",
          collapsed && "px-2",
        )}
      >
        <SidebarNav sections={getNavigationForRole(role)} collapsed={collapsed} />
      </div>

      <div className={cn("border-t border-sidebar-border p-3", collapsed && "px-2")}>
        <SidebarNav sections={[secondaryNav]} collapsed={collapsed} />
        <div className={cn("mt-2", collapsed ? "flex justify-center" : "px-1")}>
          <Tooltip
            label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            side="right"
            disabled={!collapsed}
          >
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "sm"}
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "text-muted-foreground",
                !collapsed && "w-full justify-start gap-3",
              )}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              {!collapsed && <span>Collapse</span>}
            </Button>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
