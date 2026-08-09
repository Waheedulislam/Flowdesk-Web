import * as React from "react";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  /** Must match the control's `id` so the label and messages are associated. */
  id: string;
  label: React.ReactNode;
  /** Field-level error; when set, the message replaces the hint. */
  error?: string;
  /** Helper text shown when there is no error. */
  hint?: React.ReactNode;
  required?: boolean;
  /** Optional control aligned to the right of the label (e.g. a help link). */
  labelAction?: React.ReactNode;
  className?: string;
  /**
   * The form control. Wire it up with `id`, `aria-invalid`, and
   * `aria-describedby={error ? \`${id}-error\` : hint ? \`${id}-hint\` : undefined}`.
   */
  children: React.ReactNode;
}

/**
 * Label + control + message wrapper used across the auth forms. Keeps the
 * error and hint markup (and their ids) consistent so every field announces
 * itself the same way to assistive tech.
 */
function FormField({
  id,
  label,
  error,
  hint,
  required,
  labelAction,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
        {labelAction}
      </div>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs font-medium text-destructive animate-fade-in"
        >
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export { FormField };
