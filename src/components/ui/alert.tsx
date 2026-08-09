import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        success:
          "border-success/30 bg-success/10 text-success [&_svg]:text-success",
        warning:
          "border-warning/35 bg-warning/15 text-warning-foreground [&_svg]:text-warning",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive [&_svg]:text-destructive",
        info: "border-info/30 bg-info/10 text-info [&_svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const defaultIcons: Record<
  NonNullable<VariantProps<typeof alertVariants>["variant"]>,
  LucideIcon
> = {
  default: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleAlert,
  info: Info,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  /** Override the variant's default icon; pass `null` to hide it. */
  icon?: LucideIcon | null;
}

/**
 * Inline status message for forms and pages. Used for the success and error
 * banners in the auth flows. `role` switches to "alert" for error/warning so
 * screen readers announce it promptly.
 */
function Alert({
  className,
  variant = "default",
  title,
  icon,
  children,
  ...props
}: AlertProps) {
  const resolved = variant ?? "default";
  const Icon = icon === null ? null : (icon ?? defaultIcons[resolved]);
  const assertive = resolved === "destructive" || resolved === "warning";

  return (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {Icon ? <Icon className="mt-0.5 size-4 shrink-0" aria-hidden /> : null}
      <div className="flex min-w-0 flex-col gap-0.5">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? (
          <div className="text-sm [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 opacity-90">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { Alert, alertVariants };
