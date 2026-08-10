"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import type { MemberRole } from "@/lib/workspace-data";
import { roleDescriptions, roleOptions } from "@/lib/workspace-data";

interface RoleSelectorProps {
  value: MemberRole;
  onChange: (value: MemberRole) => void;
  label?: string;
}

export function RoleSelector({
  value,
  onChange,
  label = "Role",
}: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {roleOptions.map((role) => {
          const selected = role === value;
          return (
            <button
              key={role}
              type="button"
              onClick={() => onChange(role)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                selected
                  ? "border-primary bg-primary/8 text-foreground"
                  : "border-border bg-background hover:bg-accent"
              }`}
            >
              <p className="text-sm font-semibold">{role}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {roleDescriptions[role]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
