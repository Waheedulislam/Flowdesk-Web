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

import {
  initialInvitations,
  initialMembers,
  roleDescriptions,
  workspaceActivity,
  workspaceStats,
} from "@/lib/workspace-data";

import type { MemberRole, WorkspaceMember } from "@/lib/workspace-data";

import { useAuth } from "@/context/auth-context";

import { getWorkspaces, type Workspace } from "@/lib/api/workspace.api";

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
  // AUTH
  const { accessToken, isReady } = useAuth();
  // REAL WORKSPACE DATA
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = React.useState(false);
  const [workspaceError, setWorkspaceError] = React.useState<string | null>(
    null,
  );
  // ------------------------------------------------------------
  // EXISTING MEMBER / INVITATION UI STATE
  // These will be connected to real APIs later.
  // ------------------------------------------------------------
  const [members, setMembers] = React.useState(initialMembers);
  const [invitations, setInvitations] = React.useState(initialInvitations);
  const [selectedMember, setSelectedMember] =
    React.useState<WorkspaceMember | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [pendingRole, setPendingRole] = React.useState<MemberRole>("MEMBER");
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "members" | "settings"
  >("overview");
  // ------------------------------------------------------------
  // LOAD REAL WORKSPACES
  // ------------------------------------------------------------
  React.useEffect(() => {
    if (!isReady || !accessToken) {
      return;
    }

    const token = accessToken;
    let cancelled = false;

    async function loadWorkspaces() {
      setWorkspaceLoading(true);
      setWorkspaceError(null);

      try {
        const response = await getWorkspaces(token);

        if (!cancelled) {
          setWorkspaces(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          setWorkspaceError(
            error instanceof Error
              ? error.message
              : "Failed to load workspaces.",
          );
        }
      } finally {
        if (!cancelled) {
          setWorkspaceLoading(false);
        }
      }
    }

    void loadWorkspaces();

    return () => {
      cancelled = true;
    };
  }, [accessToken, isReady]);

  // ------------------------------------------------------------
  // MEMBER ROLE
  // ------------------------------------------------------------

  const openRoleDialog = (member: WorkspaceMember) => {
    setSelectedMember(member);
    setPendingRole(member.role);
    setRoleDialogOpen(true);
  };

  const confirmRoleChange = () => {
    if (!selectedMember) return;

    setMembers((current) =>
      current.map((member) =>
        member.id === selectedMember.id
          ? {
              ...member,
              role: pendingRole,
            }
          : member,
      ),
    );

    setRoleDialogOpen(false);
  };

  // ------------------------------------------------------------
  // REMOVE MEMBER
  // ------------------------------------------------------------

  const openRemoveDialog = (member: WorkspaceMember) => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  const handleRemoveMember = () => {
    if (!selectedMember) return;

    setMembers((current) =>
      current.filter((member) => member.id !== selectedMember.id),
    );

    setRemoveDialogOpen(false);
  };

  // ------------------------------------------------------------
  // INVITATION
  // ------------------------------------------------------------

  const handleInviteSent = (email: string, role: MemberRole) => {
    setInvitations((current) => [
      {
        id: `i-${current.length + 1}`,
        email,
        role,
        status: "Pending",
        sentAt: "Just now",
        expiresAt: "In 7 days",
      },
      ...current,
    ]);
  };

  // ------------------------------------------------------------
  // AUTH / LOADING
  // ------------------------------------------------------------

  if (!isReady || workspaceLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading workspace...</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // ERROR
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // NO WORKSPACE
  // ------------------------------------------------------------

  if (workspaces.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="font-semibold">No workspace found</p>

            <p className="mt-2 text-sm text-muted-foreground">
              You do not have any workspace yet. Create one to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // CURRENT WORKSPACE
  const currentWorkspace = workspaces[0];

  // ------------------------------------------------------------
  // REAL WORKSPACE OVERVIEW
  // ------------------------------------------------------------
  const overviewData: WorkspaceOverview = {
    name: currentWorkspace.name,
    description: currentWorkspace.description ?? "",
    logoLabel: currentWorkspace.logo ?? currentWorkspace.name,
    status: currentWorkspace.status,
    // Owner details will become real after
    // GET /api/v1/workspaces/:slug
    ownerName: "Workspace Owner",
    ownerEmail: "",
    memberCount: members.length,
    projectCount: 0,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1st section */}
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

        <Button onClick={() => setInviteDialogOpen(true)}>Invite member</Button>
      </div>

      {/* 2nd section */}
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

      {/* 3rd section */}
      <WorkspaceHeader workspace={overviewData} />

      {/* OVERVIEW */}
      {activeTab === "overview" ? (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <WorkspaceActivityPanel activity={workspaceActivity} />

            <PendingInvitations invitations={invitations} />
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

      {/* MEMBERS */}
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

          <MemberTable
            members={members}
            onOpenRoleDialog={openRoleDialog}
            onOpenRemoveDialog={openRemoveDialog}
          />

          <PendingInvitations invitations={invitations} />
        </div>
      ) : null}

      {/* SETTINGS */}
      {activeTab === "settings" ? (
        <WorkspaceSettings workspace={overviewData} />
      ) : null}

      {/* INVITE */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInviteSent={handleInviteSent}
      />

      {/* MOBILE CONTROLS */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
          <span className="font-medium">Workspace controls</span>

          <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
            Invite
          </Button>
        </div>
      </div>

      {/* ROLE DIALOG */}
      {roleDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-border/70 shadow-2xl">
            <CardHeader>
              <CardTitle>Change role</CardTitle>

              <p className="text-sm text-muted-foreground">
                Adjust access for {selectedMember?.name}.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <RoleSelector value={pendingRole} onChange={setPendingRole} />

              <div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-sm text-muted-foreground">
                {roleDescriptions[pendingRole]}
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setRoleDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button onClick={confirmRoleChange}>Save role</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* REMOVE MEMBER */}
      <RemoveMemberDialog
        member={selectedMember}
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}
