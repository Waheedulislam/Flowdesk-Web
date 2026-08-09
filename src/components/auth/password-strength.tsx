"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPasswordChecks, getPasswordStrength } from "@/lib/validation";

const BAR_COLORS = [
  "bg-border",
  "bg-destructive",
  "bg-warning",
  "bg-info",
  "bg-success",
] as const;

const LABEL_COLORS = [
  "text-muted-foreground",
  "text-destructive",
  "text-warning-foreground",
  "text-info",
  "text-success",
] as const;

const REQUIREMENTS: { key: keyof ReturnType<typeof getPasswordChecks>; label: string }[] = [
  { key: "length", label: "8+ characters" },
  { key: "uppercase", label: "Uppercase letter" },
  { key: "lowercase", label: "Lowercase letter" },
  { key: "number", label: "Number" },
];

/**
 * Visual password strength meter: four segments that fill as more rules are
 * met, plus a compact requirements checklist. Purely presentational — it
 * reads the same rules the form uses to validate.
 */
export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;

  const { score, label } = getPasswordStrength(value);
  const checks = getPasswordChecks(value);

  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i < score ? BAR_COLORS[score] : "bg-border",
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "w-16 text-right text-xs font-medium",
            LABEL_COLORS[score],
          )}
        >
          {label}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {REQUIREMENTS.map(({ key, label: reqLabel }) => {
          const met = checks[key];
          return (
            <li
              key={key}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors",
                met ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-3.5 shrink-0 items-center justify-center rounded-full transition-colors",
                  met
                    ? "bg-success/15 text-success"
                    : "border border-border",
                )}
              >
                {met ? <Check className="size-2.5" strokeWidth={3} /> : null}
              </span>
              {reqLabel}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
