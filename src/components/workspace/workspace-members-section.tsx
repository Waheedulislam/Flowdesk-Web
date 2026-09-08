"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberTable } from "@/components/workspace/member-table";
import { PendingInvitations } from "@/components/workspace/pending-invitations";
import type {
  WorkspaceInvitation,
  WorkspaceMemberRecord,
  WorkspaceMemberRole,
} from "@/lib/api/workspace.api";

type Props = {
  members: WorkspaceMemberRecord[];
  membersLoading: boolean;
  membersError: string | null;
  role: WorkspaceMemberRole;
  canInvite: boolean;
  invitations: WorkspaceInvitation[];
  invitationsLoading: boolean;
  invitationsError: string | null;
  onInvite: () => void;
  onRole: (member: WorkspaceMemberRecord) => void;
  onRemove: (member: WorkspaceMemberRecord) => void;
  onCancel: (invitation: WorkspaceInvitation) => void;
  onRetryMembers: () => void;
  onRetryInvitations: () => void;
};

export function WorkspaceMembersSection({
  members,
  membersLoading,
  membersError,
  role,
  canInvite,
  invitations,
  invitationsLoading,
  invitationsError,
  onInvite,
  onRole,
  onRemove,
  onCancel,
  onRetryMembers,
  onRetryInvitations,
}: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Member management</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage access and the composition of your workspace.
            </p>
          </div>
          {canInvite ? (
            <Button variant="outline" onClick={onInvite}>
              Invite member
            </Button>
          ) : null}
        </CardHeader>
      </Card>
      {membersLoading ? (
        <Card>
          <CardContent className="flex min-h-44 items-center justify-center text-sm text-muted-foreground">
            Loading members...
          </CardContent>
        </Card>
      ) : membersError ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="font-medium">Unable to load members</p>
            <p className="mt-2 text-sm text-muted-foreground">{membersError}</p>
            <Button className="mt-4" variant="outline" onClick={onRetryMembers}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <MemberTable
          members={members}
          currentUserRole={role}
          onOpenRoleDialog={onRole}
          onOpenRemoveDialog={onRemove}
        />
      )}
      {canInvite ? (
        <PendingInvitations
          invitations={invitations}
          loading={invitationsLoading}
          error={invitationsError}
          onCancel={onCancel}
          onRetry={onRetryInvitations}
        />
      ) : null}
    </div>
  );
}
