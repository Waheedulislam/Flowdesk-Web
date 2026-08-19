"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { MemberTable } from "@/components/workspace/member-table";
import { PendingInvitations } from "@/components/workspace/pending-invitations";
import { RemoveMemberDialog } from "@/components/workspace/remove-member-dialog";
import { RoleSelector } from "@/components/workspace/role-selector";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceOverview as WorkspaceActivityPanel } from "@/components/workspace/workspace-overview";
import { WorkspaceSettings } from "@/components/workspace/workspace-settings";
import { WorkspaceStats } from "@/components/workspace/workspace-stats";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";

import {
  roleDescriptions,
  workspaceActivity,
  workspaceStats,
} from "@/lib/workspace-data";
import { toast } from "sonner";
import type { MemberRole } from "@/lib/workspace-data";

import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";

import {
  getWorkspaceBySlug,
  getWorkspaceMembers,
  getWorkspaceInvitations,
  updateMemberRole,
  type WorkspaceDetail,
  type WorkspaceMemberRecord,
  type WorkspaceMemberRole,
  type WorkspaceInvitation,
} from "@/lib/api/workspace.api";

export interface WorkspaceOverview {
  name: string;
  description: string;
  logoLabel: string;
  status: string;
  ownerName: string;
  ownerEmail: string;
  memberCount: number;
  projectCount: number;
}

export function WorkspacePage() {
  /* ============================================================
     AUTH
  ============================================================ */

  const { accessToken, isReady } = useAuth();

  /* ============================================================
     WORKSPACE CONTEXT
  ============================================================ */

  const {
    workspaces,
    activeWorkspace,
    isLoading: workspaceLoading,
    error: workspaceListError,
  } = useWorkspace();

  /* ============================================================
     WORKSPACE DETAIL
  ============================================================ */

  const [workspaceDetail, setWorkspaceDetail] =
    React.useState<WorkspaceDetail | null>(null);

  const [workspaceDetailError, setWorkspaceDetailError] = React.useState<
    string | null
  >(null);

  /* ============================================================
     MEMBERS
  ============================================================ */

  const [members, setMembers] = React.useState<WorkspaceMemberRecord[]>([]);

  const [membersLoading, setMembersLoading] = React.useState(false);

  const [membersError, setMembersError] = React.useState<string | null>(null);

  /* ============================================================
     INVITATIONS
  ============================================================ */

  const [invitations, setInvitations] = React.useState<WorkspaceInvitation[]>(
    [],
  );

  const [invitationsLoading, setInvitationsLoading] = React.useState(false);

  const [invitationsError, setInvitationsError] = React.useState<string | null>(
    null,
  );

  /* ============================================================
     DIALOG STATE
  ============================================================ */

  const [selectedMember, setSelectedMember] =
    React.useState<WorkspaceMemberRecord | null>(null);

  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);

  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);

  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  const [createWorkspaceDialogOpen, setCreateWorkspaceDialogOpen] =
    React.useState(false);

  /* ============================================================
     ROLE UPDATE STATE
  ============================================================ */

  const [pendingRole, setPendingRole] =
    React.useState<WorkspaceMemberRole>("MEMBER");

  const [roleUpdating, setRoleUpdating] = React.useState(false);

  const [roleUpdateError, setRoleUpdateError] = React.useState<string | null>(
    null,
  );

  /* ============================================================
     ACTIVE TAB
  ============================================================ */

  const [activeTab, setActiveTab] = React.useState<
    "overview" | "members" | "settings"
  >("overview");

  /* ============================================================
     LOAD WORKSPACE DETAIL
  ============================================================ */

  React.useEffect(() => {
    if (!isReady || !accessToken || !activeWorkspace?.slug) {
      return;
    }

    const token = accessToken;
    const slug = activeWorkspace.slug;

    let cancelled = false;

    async function loadWorkspaceDetail() {
      try {
        const response = await getWorkspaceBySlug(token, slug);

        if (cancelled) return;

        setWorkspaceDetail(response.data);
        setWorkspaceDetailError(null);
      } catch (error) {
        if (cancelled) return;

        setWorkspaceDetailError(
          error instanceof Error
            ? error.message
            : "Failed to load workspace details.",
        );
      }
    }

    void loadWorkspaceDetail();

    return () => {
      cancelled = true;
    };
  }, [accessToken, activeWorkspace?.slug, isReady]);

  /* ============================================================
     LOAD WORKSPACE MEMBERS
  ============================================================ */

  React.useEffect(() => {
    if (!isReady || !accessToken || !activeWorkspace?.id) {
      return;
    }

    const token = accessToken;
    const workspaceId = activeWorkspace.id;

    let cancelled = false;

    async function loadMembers() {
      setMembersLoading(true);
      setMembersError(null);

      try {
        const response = await getWorkspaceMembers(token, workspaceId);

        if (cancelled) return;

        setMembers(response.data);
      } catch (error) {
        if (cancelled) return;

        setMembersError(
          error instanceof Error
            ? error.message
            : "Failed to load workspace members.",
        );

        setMembers([]);
      } finally {
        if (!cancelled) {
          setMembersLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, [accessToken, activeWorkspace?.id, isReady]);

  React.useEffect(() => {
    if (!isReady || !accessToken || !activeWorkspace?.id) {
      return;
    }

    const token = accessToken;
    const workspaceId = activeWorkspace.id;

    let cancelled = false;

    async function loadInvitations() {
      setInvitationsLoading(true);
      setInvitationsError(null);

      try {
        const response = await getWorkspaceInvitations(token, workspaceId);

        if (cancelled) return;

        setInvitations(response.data);
      } catch (error) {
        if (cancelled) return;

        setInvitationsError(
          error instanceof Error
            ? error.message
            : "Failed to load workspace invitations.",
        );

        setInvitations([]);
      } finally {
        if (!cancelled) {
          setInvitationsLoading(false);
        }
      }
    }

    void loadInvitations();

    return () => {
      cancelled = true;
    };
  }, [accessToken, activeWorkspace?.id, isReady]);

  /* ============================================================
     OPEN ROLE DIALOG
  ============================================================ */

  const openRoleDialog = (member: WorkspaceMemberRecord) => {
    // Owner role cannot be changed.
    if (member.role === "OWNER") {
      return;
    }

    setSelectedMember(member);
    setPendingRole(member.role);
    setRoleUpdateError(null);
    setRoleDialogOpen(true);
  };

  /* ============================================================
     UPDATE MEMBER ROLE
  ============================================================ */

  const confirmRoleChange = async () => {
    if (!selectedMember || !accessToken || !activeWorkspace?.id) {
      return;
    }

    // Never allow OWNER from frontend.
    // Backend also protects this.
    if (pendingRole === "OWNER") {
      setRoleUpdateError("Owner role cannot be assigned.");
      return;
    }

    // Nothing changed.
    if (pendingRole === selectedMember.role) {
      setRoleDialogOpen(false);
      return;
    }

    setRoleUpdating(true);
    setRoleUpdateError(null);

    try {
      await updateMemberRole(
        accessToken,
        activeWorkspace.id,
        selectedMember.id,
        {
          role: pendingRole,
        },
      );

      /*
       * Backend successfully updated the role.
       * Now update the local member list so the UI
       * changes immediately without another GET request.
       */

      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member.id === selectedMember.id
            ? {
                ...member,
                role: pendingRole,
              }
            : member,
        ),
      );

      setSelectedMember(null);
      setRoleDialogOpen(false);
    } catch (error) {
      setRoleUpdateError(
        error instanceof Error
          ? error.message
          : "Failed to update member role.",
      );
    } finally {
      setRoleUpdating(false);
    }
  };

  /* ============================================================
     CLOSE ROLE DIALOG
  ============================================================ */

  const handleRoleDialogChange = (open: boolean) => {
    if (roleUpdating) {
      return;
    }

    setRoleDialogOpen(open);

    if (!open) {
      setSelectedMember(null);
      setRoleUpdateError(null);
    }
  };

  /* ============================================================
     OPEN REMOVE DIALOG
  ============================================================ */

  const openRemoveDialog = (member: WorkspaceMemberRecord) => {
    // Owner cannot be removed.
    if (member.role === "OWNER") {
      return;
    }

    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  /* ============================================================
     MEMBER REMOVED
  ============================================================ */

  const handleMemberRemoved = (memberId: string) => {
    const removedMember = members.find((member) => member.id === memberId);

    setMembers((currentMembers) =>
      currentMembers.filter((member) => member.id !== memberId),
    );

    setSelectedMember(null);
    setRemoveDialogOpen(false);

    toast.success("Member removed successfully", {
      description: removedMember
        ? `${removedMember.user.name} has been removed from this workspace.`
        : "The member has been removed from this workspace.",
    });
  };

  /* ============================================================
     INVITATION
  ============================================================ */

  const handleInviteSent = () => {
    if (!accessToken || !activeWorkspace?.id) {
      return;
    }

    void (async () => {
      try {
        const response = await getWorkspaceInvitations(
          accessToken,
          activeWorkspace.id,
        );

        setInvitations(response.data);
      } catch {
        // Invitation was already sent successfully.
        // The next page refresh will load the correct data.
      }
    })();
  };

  /* ============================================================
     INITIAL LOADING
  ============================================================ */

  if (!isReady || workspaceLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading workspace...</p>
      </div>
    );
  }

  /* ============================================================
     WORKSPACE ERROR
  ============================================================ */

  const workspaceError = workspaceListError || workspaceDetailError;

  if (workspaceError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="font-semibold">Unable to load workspace</p>

            <p className="mt-2 text-sm text-muted-foreground">
              {workspaceError}
            </p>

            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ============================================================
     NO WORKSPACE
  ============================================================ */

  if (workspaces.length === 0 || !activeWorkspace) {
    return (
      <>
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <p className="font-semibold">No workspace found</p>

              <p className="mt-2 text-sm text-muted-foreground">
                You do not have any workspace yet. Create one to get started.
              </p>

              <Button
                className="mt-4"
                onClick={() => setCreateWorkspaceDialogOpen(true)}
              >
                Create workspace
              </Button>
            </CardContent>
          </Card>
        </div>

        <CreateWorkspaceDialog
          open={createWorkspaceDialogOpen}
          onOpenChange={setCreateWorkspaceDialogOpen}
        />
      </>
    );
  }

  /* ============================================================
     CURRENT WORKSPACE
  ============================================================ */

  const currentWorkspace = workspaceDetail ?? activeWorkspace;

  /* ============================================================
     OVERVIEW DATA
  ============================================================ */

  const overviewData: WorkspaceOverview = {
    name: currentWorkspace.name,

    description: currentWorkspace.description ?? "",

    logoLabel: currentWorkspace.logo ?? currentWorkspace.name,

    status: currentWorkspace.status,

    ownerName: workspaceDetail?.owner.name ?? "Workspace Owner",

    ownerEmail: workspaceDetail?.owner.email ?? "",

    memberCount: members.length,

    projectCount: 0,
  };

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <div className="flex flex-col gap-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Manage your workspace
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {currentWorkspace.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCreateWorkspaceDialogOpen(true)}
          >
            Create workspace
          </Button>

          <Button onClick={() => setInviteDialogOpen(true)}>
            Invite member
          </Button>
        </div>
      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="flex flex-wrap gap-2">
        {[
          {
            key: "overview",
            label: "Overview",
          },
          {
            key: "members",
            label: "Members",
          },
          {
            key: "settings",
            label: "Settings",
          },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() =>
              setActiveTab(tab.key as "overview" | "members" | "settings")
            }
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================
          WORKSPACE HEADER
      ====================================================== */}

      <WorkspaceHeader workspace={overviewData} />

      {/* ======================================================
          OVERVIEW
      ====================================================== */}

      {activeTab === "overview" ? (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <WorkspaceActivityPanel activity={workspaceActivity} />

            <PendingInvitations
              invitations={invitations}
              loading={invitationsLoading}
              error={invitationsError}
            />
          </div>

          <div className="space-y-6">
            <WorkspaceStats stats={workspaceStats} />

            <Card>
              <CardHeader>
                <CardTitle>Workspace overview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                  <span>Workspace</span>

                  <span className="font-medium text-foreground">
                    {currentWorkspace.name}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                  <span>Status</span>

                  <span className="font-medium text-foreground">
                    {currentWorkspace.status}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                  <span>Your role</span>

                  <span className="font-medium text-foreground">
                    {currentWorkspace.role}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                  <span>Owner</span>

                  <span className="font-medium text-foreground">
                    {overviewData.ownerName}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                  <span>Member count</span>

                  <span className="font-medium text-foreground">
                    {members.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                  <span>Projects</span>

                  <span className="font-medium text-foreground">
                    {overviewData.projectCount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ======================================================
          MEMBERS
      ====================================================== */}

      {activeTab === "members" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Member management</CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage access, invitations, and the composition of your
                  workspace.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(true)}
              >
                Invite member
              </Button>
            </CardHeader>
          </Card>
          {membersLoading ? (
            <Card>
              <CardContent className="flex min-h-[180px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading members...
                </p>
              </CardContent>
            </Card>
          ) : membersError ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="font-medium">Unable to load members</p>

                <p className="mt-2 text-sm text-muted-foreground">
                  {membersError}
                </p>
              </CardContent>
            </Card>
          ) : (
            <MemberTable
              members={members}
              currentUserRole={currentWorkspace.role}
              onOpenRoleDialog={openRoleDialog}
              onOpenRemoveDialog={openRemoveDialog}
            />
          )}
          <PendingInvitations
            invitations={invitations}
            loading={invitationsLoading}
            error={invitationsError}
          />
        </div>
      ) : null}

      {/* ======================================================
          SETTINGS
      ====================================================== */}

      {activeTab === "settings" ? (
        <WorkspaceSettings workspace={overviewData} />
      ) : null}

      {/* ======================================================
          INVITE
      ====================================================== */}

      <InviteMemberDialog
        open={inviteDialogOpen}
        workspaceId={activeWorkspace.id}
        onOpenChange={setInviteDialogOpen}
        onInviteSent={handleInviteSent}
      />

      {/* ======================================================
          CREATE WORKSPACE
      ====================================================== */}

      <CreateWorkspaceDialog
        open={createWorkspaceDialogOpen}
        onOpenChange={setCreateWorkspaceDialogOpen}
      />

      {/* ======================================================
          MOBILE CONTROLS
      ====================================================== */}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <span className="font-medium">Workspace controls</span>

          <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
            Invite
          </Button>
        </div>
      </div>

      {/* ======================================================
          ROLE DIALOG
      ====================================================== */}

      {roleDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-border/70 shadow-2xl">
            <CardHeader>
              <CardTitle>Change role</CardTitle>

              <p className="text-sm text-muted-foreground">
                Adjust access for{" "}
                <span className="font-medium text-foreground">
                  {selectedMember?.user.name}
                </span>
                .
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <RoleSelector
                value={pendingRole}
                onChange={setPendingRole}
                disabled={roleUpdating}
              />

              <div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-sm text-muted-foreground">
                {roleDescriptions[pendingRole] ??
                  "Manage workspace access for this member."}
              </div>

              {roleUpdateError ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                  {roleUpdateError}
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => handleRoleDialogChange(false)}
                  disabled={roleUpdating}
                >
                  Cancel
                </Button>

                <Button
                  onClick={confirmRoleChange}
                  disabled={
                    roleUpdating ||
                    !selectedMember ||
                    pendingRole === selectedMember.role
                  }
                >
                  {roleUpdating ? "Saving..." : "Save role"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* ======================================================
          REMOVE MEMBER
      ====================================================== */}

      <RemoveMemberDialog
        member={selectedMember}
        workspaceId={activeWorkspace.id}
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        onSuccess={handleMemberRemoved}
      />
    </div>
  );
}
