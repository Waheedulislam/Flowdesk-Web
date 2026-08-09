"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type"> {
  /** Optional inline label rendered to the right of the box. */
  label?: React.ReactNode;
}

/**
 * Accessible checkbox built on a native input so it works inside forms and
 * with the keyboard out of the box. The native control is visually replaced
 * with a styled box and a check glyph that appears on `:checked`.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <span className="inline-flex items-start gap-2">
        <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={cn(
              "peer size-4 cursor-pointer appearance-none rounded border border-input bg-background shadow-sm transition-colors",
              "checked:border-primary checked:bg-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            {...props}
          />
          <Check
            aria-hidden
            strokeWidth={3}
            className="pointer-events-none absolute hidden size-3 text-primary-foreground peer-checked:block"
          />
        </span>
        {label ? (
          <label
            htmlFor={inputId}
            className="cursor-pointer select-none text-sm leading-tight text-foreground"
          >
            {label}
          </label>
        ) : null}
      </span>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
