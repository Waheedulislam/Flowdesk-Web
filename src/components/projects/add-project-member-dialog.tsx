"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import type {
  AddProjectMemberPayload,
  ProjectRole,
} from "@/lib/api/project.api";
import type { WorkspaceMemberRecord } from "@/lib/api/workspace.api";

interface AddProjectMemberDialogProps {
  open: boolean;
  members: WorkspaceMemberRecord[];
  existingUserIds: Set<string>;
  membersLoading: boolean;
  membersError: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AddProjectMemberPayload) => Promise<void>;
}

export function AddProjectMemberDialog({
  open,
  members,
  existingUserIds,
  membersLoading,
  membersError,
  onOpenChange,
  onSubmit,
}: AddProjectMemberDialogProps) {
  const [query, setQuery] = React.useState("");
  const [selectedUserId, setSelectedUserId] = React.useState("");
  const [role, setRole] =
    React.useState<Exclude<ProjectRole, "PROJECT_ADMIN">>("DEVELOPER");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!open) return null;

  const availableMembers = members.filter((member) => {
    if (existingUserIds.has(member.userId)) return false;
    const searchText = `${member.user.name} ${member.user.email}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  const close = () => {
    setQuery("");
    setSelectedUserId("");
    setRole("DEVELOPER");
    setError(null);
    onOpenChange(false);
  };

  const submit = async () => {
    if (!selectedUserId) {
      setError("Select a workspace member first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ userId: selectedUserId, role });
      close();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to add project member.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto shadow-2xl">
        <CardHeader>
          <CardTitle>Add project member</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a member of this workspace and choose their project role.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search members..."
            aria-label="Search workspace members"
          />
          <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border/70 p-2">
            {membersLoading ? (
              <p className="p-3 text-sm text-muted-foreground">
                Loading workspace members...
              </p>
            ) : membersError ? (
              <p className="p-3 text-sm text-destructive">{membersError}</p>
            ) : availableMembers.length ? (
              availableMembers.map((member) => (
                <label
                  key={member.userId}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent"
                >
                  <input
                    type="radio"
                    name="project-member"
                    value={member.userId}
                    checked={selectedUserId === member.userId}
                    onChange={() => setSelectedUserId(member.userId)}
                  />
                  <Avatar
                    name={member.user.name}
                    src={member.user.avatar ?? undefined}
                    className="size-8"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {member.user.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {member.user.email}
                    </span>
                  </span>
                </label>
              ))
            ) : (
              <p className="p-3 text-sm text-muted-foreground">
                No eligible workspace members found.
              </p>
            )}
          </div>
          <label className="block space-y-1 text-sm font-medium">
            <span>Project role</span>
            <select
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as Exclude<ProjectRole, "PROJECT_ADMIN">,
                )
              }
              disabled={loading}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
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
              disabled={loading || !selectedUserId}
            >
              {loading ? "Adding..." : "Add member"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
