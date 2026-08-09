"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import type { NavSection } from "@/types";

interface SidebarNavProps {
  sections: NavSection[];
  /** Collapsed rail hides labels and shows tooltips (desktop only). */
  collapsed?: boolean;
  /** Called after navigating; used to close the mobile drawer. */
  onNavigate?: () => void;
}

/**
 * Renders navigation sections for both the desktop sidebar and the mobile
 * drawer. Active state is derived from the current pathname.
 */
export function SidebarNav({
  sections,
  collapsed = false,
  onNavigate,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-6" aria-label="Primary">
      {sections.map((section, index) => (
        <div key={section.label ?? index} className="flex flex-col gap-1">
          {section.label ? (
            <p
              className={cn(
                "px-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground",
                collapsed && "sr-only",
              )}
            >
              {section.label}
            </p>
          ) : null}

          {section.items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Tooltip
                key={item.href}
                label={item.title}
                side="right"
                disabled={!collapsed}
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={item.disabled || undefined}
                  onClick={(e) => {
                    if (item.disabled) {
                      e.preventDefault();
                      return;
                    }
                    onNavigate?.();
                  }}
                  className={cn(
                    "group/navlink relative flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium outline-none transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    collapsed && "w-full justify-center px-0",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    item.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                  )}
                >
                  {isActive ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-0 h-5 w-0.5 rounded-r-full bg-sidebar-primary",
                        collapsed && "left-0",
                      )}
                    />
                  ) : null}
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive
                        ? "text-sidebar-primary"
                        : "text-muted-foreground group-hover/navlink:text-sidebar-foreground",
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                  {!collapsed && item.badge ? (
                    <Badge variant="secondary" className="ml-auto px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  ) : null}
                  {!collapsed && item.disabled ? (
                    <span className="ml-auto text-[0.625rem] font-normal uppercase tracking-wide text-muted-foreground">
                      Soon
                    </span>
                  ) : null}
                </Link>
              </Tooltip>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
