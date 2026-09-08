"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleSelector } from "@/components/workspace/role-selector";
import { roleDescriptions } from "@/lib/workspace-data";
import {
  updateMemberRole,
  type WorkspaceMemberRecord,
  type WorkspaceMemberRole,
} from "@/lib/api/workspace.api";
import { useAuth } from "@/context/auth-context";

type Props = {
  member: WorkspaceMemberRecord | null;
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (memberId: string, role: WorkspaceMemberRole) => void;
};

export function RoleDialog({
  member,
  workspaceId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { accessToken } = useAuth();
  const [role, setRole] = React.useState<WorkspaceMemberRole>(
    () => member?.role ?? "MEMBER",
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  if (!open || !member) return null;
  const save = async () => {
    if (!accessToken || !workspaceId || role === "OWNER") return;
    setLoading(true);
    setError(null);
    try {
      await updateMemberRole(accessToken, workspaceId, member.id, { role });
      onSuccess(member.id, role);
      toast.success("Member role updated");
      onOpenChange(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to update member role.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto border-border/70 shadow-2xl">
        <CardHeader>
          <CardTitle>Change role</CardTitle>
          <p className="text-sm text-muted-foreground">
            Adjust access for{" "}
            <span className="font-medium text-foreground">
              {member.user.name}
            </span>
            .
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleSelector
            value={role}
            onChange={setRole}
            disabled={loading}
            roles={["ADMIN", "MEMBER"]}
          />
          <div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-sm text-muted-foreground">
            {roleDescriptions[role] ??
              "Manage workspace access for this member."}
          </div>
          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={loading || role === member.role || role === "OWNER"}
            >
              {loading ? "Saving..." : "Save role"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
