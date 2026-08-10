import type { Tone } from "@/lib/dashboard-data";

/**
 * Shared tone → utility-class maps for the dashboard.
 * Values track the existing Badge variants so accents stay on-palette in both
 * light and dark mode. Keeping these in one place avoids drift between the
 * StatCard, activity feed, notifications, and task list.
 */

/** Soft chip: tinted background + colored icon/text. */
export const toneChip: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/18 text-warning-foreground",
  info: "bg-info/12 text-info",
  destructive: "bg-destructive/12 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

/** Foreground-only accent for text/icons on a plain surface. */
export const toneText: Record<Tone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning-foreground",
  info: "text-info",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

/** Solid dot/swatch, used by charts and legends. */
export const toneDot: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground/50",
};
