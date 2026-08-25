"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectMemberRecord, ProjectRole } from "@/lib/api/project.api";

interface ProjectMemberRoleDialogProps {
  member: ProjectMemberRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (role: ProjectRole) => Promise<void>;
}

export function ProjectMemberRoleDialog({
  member,
  open,
  onOpenChange,
  onSubmit,
}: ProjectMemberRoleDialogProps) {
  const [role, setRole] = React.useState<ProjectRole>(
    member?.role ?? "DEVELOPER",
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!open || !member) return null;

  const close = () => {
    setError(null);
    onOpenChange(false);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit(role);
      close();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to update project member role.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Change member role</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update access for{" "}
            <span className="font-medium text-foreground">
              {member.user.name}
            </span>
            .
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-1 text-sm font-medium">
            <span>New project role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as ProjectRole)}
              disabled={loading}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="PROJECT_ADMIN">Project admin</option>
              <option value="DEVELOPER">Developer</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </label>
          {error ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={close} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={() => void submit()}
              disabled={loading || role === member.role}
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
