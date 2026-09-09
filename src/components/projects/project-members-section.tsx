"use client";

import * as React from "react";
import { MoreHorizontal, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { AddProjectMemberDialog } from "@/components/projects/add-project-member-dialog";
import { ProjectMemberRoleDialog } from "@/components/projects/project-member-role-dialog";
import { RemoveProjectMemberDialog } from "@/components/projects/remove-project-member-dialog";
import { useProjectMembers } from "@/components/projects/hooks/use-project-members";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { useWorkspaceMembers } from "@/components/workspace/hooks/use-workspace-members";
import type { ProjectMemberRecord, ProjectRole } from "@/lib/api/project.api";
import type { WorkspaceMemberRole } from "@/lib/api/workspace.api";

interface ProjectMembersSectionProps {
  projectId: string;
  workspaceId: string;
  workspaceRole: WorkspaceMemberRole;
}

const roleLabels: Record<ProjectRole, string> = {
  PROJECT_ADMIN: "Project admin",
  DEVELOPER: "Developer",
  VIEWER: "Viewer",
};

const roleVariants: Record<ProjectRole, BadgeProps["variant"]> = {
  PROJECT_ADMIN: "default",
  DEVELOPER: "info",
  VIEWER: "secondary",
};

function canManageProjectMember(
  workspaceRole: WorkspaceMemberRole,
  currentMember: ProjectMemberRecord | undefined,
  targetMember: ProjectMemberRecord,
) {
  if (workspaceRole === "OWNER") return true;
  return (
    currentMember?.role === "PROJECT_ADMIN" &&
    targetMember.role !== "PROJECT_ADMIN"
  );
}

export function ProjectMembersSection({
  projectId,
  workspaceId,
  workspaceRole,
}: ProjectMembersSectionProps) {
  const { accessToken, isReady, user } = useAuth();
  const projectMembers = useProjectMembers({ accessToken, isReady, projectId });
  const workspaceMembers = useWorkspaceMembers({
    accessToken,
    isReady,
    workspaceId,
  });
  const [addOpen, setAddOpen] = React.useState(false);
  const [roleMember, setRoleMember] =
    React.useState<ProjectMemberRecord | null>(null);
  const [removeMember, setRemoveMember] =
    React.useState<ProjectMemberRecord | null>(null);

  const currentMember = projectMembers.members.find(
    (member) => member.userId === user?.id,
  );
  const canAdd = workspaceRole === "OWNER" || workspaceRole === "ADMIN";
  const existingUserIds = new Set(
    projectMembers.members.map((member) => member.userId),
  );

  const handleAdd = async (
    payload: Parameters<typeof projectMembers.addMember>[0],
  ) => {
    await projectMembers.addMember(payload);
    toast.success("Project member added successfully");
  };

  const handleRoleUpdate = async (role: ProjectRole) => {
    if (!roleMember) return;
    await projectMembers.updateRole(roleMember.id, role);
    toast.success("Project member role updated");
  };

  const handleRemove = async () => {
    if (!removeMember) return;
    await projectMembers.removeMember(removeMember.id);
    toast.success("Project member removed");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Project members</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage access for selected workspace members.
            </p>
          </div>
          {canAdd ? (
            <Button variant="outline" onClick={() => setAddOpen(true)}>
              Add member
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          {projectMembers.loading ? (
            <div className="flex min-h-28 items-center justify-center text-sm text-muted-foreground">
              Loading project members...
            </div>
          ) : projectMembers.error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
              <p className="font-medium text-destructive">
                Unable to load project members.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {projectMembers.error}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => void projectMembers.reload()}
              >
                <RefreshCw className="size-4" />
                Try again
              </Button>
            </div>
          ) : projectMembers.members.length ? (
            <div className="divide-y divide-border/70">
              {projectMembers.members.map((member) => {
                const canManage = canManageProjectMember(
                  workspaceRole,
                  currentMember,
                  member,
                );
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Avatar
                      name={member.user.name}
                      src={member.user.avatar ?? undefined}
                      className="size-9"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {member.user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.user.email}
                      </p>
                    </div>
                    <Badge variant={roleVariants[member.role]}>
                      {roleLabels[member.role]}
                    </Badge>
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </span>
                    {canManage ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${member.user.name}`}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background hover:bg-accent"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setRoleMember(member)}
                          >
                            Change role
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setRemoveMember(member)}
                          >
                            Remove from project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="font-medium">No project members yet.</p>
              {canAdd ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Add workspace members when this project is ready for them.
                </p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
      <AddProjectMemberDialog
        open={addOpen}
        members={workspaceMembers.members}
        existingUserIds={existingUserIds}
        membersLoading={workspaceMembers.loading}
        membersError={workspaceMembers.error}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />
      <ProjectMemberRoleDialog
        key={roleMember?.id ?? "role-dialog"}
        member={roleMember}
        open={Boolean(roleMember)}
        onOpenChange={(open) => {
          if (!open) setRoleMember(null);
        }}
        onSubmit={handleRoleUpdate}
      />
      <RemoveProjectMemberDialog
        member={removeMember}
        open={Boolean(removeMember)}
        onOpenChange={(open) => {
          if (!open) setRemoveMember(null);
        }}
        onSubmit={handleRemove}
      />
    </>
  );
}
