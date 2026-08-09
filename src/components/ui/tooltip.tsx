"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  /** Text shown in the tooltip bubble. */
  label: React.ReactNode;
  side?: Side;
  /** When true, renders no bubble (useful for expanded sidebar). */
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sideClasses: Record<Side, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
};

/**
 * A dependency-free tooltip driven by hover and keyboard focus.
 * Uses CSS group state so it works without positioning libraries; ideal for
 * icon-only controls like the collapsed sidebar rail.
 */
function Tooltip({
  label,
  side = "right",
  disabled = false,
  children,
  className,
}: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 hidden w-max max-w-xs whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md",
          "opacity-0 transition-opacity duration-150",
          "group-hover/tooltip:block group-hover/tooltip:opacity-100",
          "group-focus-within/tooltip:block group-focus-within/tooltip:opacity-100",
          sideClasses[side],
        )}
      >
        {label}
      </span>
    </span>
  );
}

export { Tooltip };
