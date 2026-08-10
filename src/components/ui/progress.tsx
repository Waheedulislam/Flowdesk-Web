import * as React from "react";

import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/dashboard-data";

/**
 * Minimal, dependency-free progress bar.
 * Presentational only — the caller supplies a 0–100 `value` and a semantic
 * `tone` that maps onto the FlowDesk color tokens.
 */

const toneToBar: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground/40",
};

interface ProgressProps extends React.ComponentProps<"div"> {
  /** 0–100. Values outside the range are clamped. */
  value: number;
  tone?: Tone;
}

function Progress({ className, value, tone = "primary", ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          toneToBar[tone],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
