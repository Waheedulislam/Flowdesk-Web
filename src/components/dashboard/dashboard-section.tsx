import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A titled dashboard section: a header row (title + optional description and
 * trailing action) above arbitrary content. Keeps spacing and typography
 * consistent across every panel on the dashboard.
 */

interface DashboardSectionProps extends React.ComponentProps<"section"> {
  title: string;
  description?: string;
  /** Optional trailing control, e.g. a "View all" link or a toggle. */
  action?: React.ReactNode;
  /** Renders the header visually hidden but available to screen readers. */
  hideHeader?: boolean;
}

function DashboardSection({
  title,
  description,
  action,
  hideHeader = false,
  className,
  children,
  ...props
}: DashboardSectionProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      {hideHeader ? (
        <h2 className="sr-only">{title}</h2>
      ) : (
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export { DashboardSection };
