"use client";

import * as React from "react";

import { AppShell } from "@/components/layout/app-shell";
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
  workspaceOverview,
  workspaceStats,
} from "@/lib/workspace-data";
import type { MemberRole, WorkspaceMember } from "@/lib/workspace-data";

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
          ? { ...member, role: pendingRole }
          : member,
      ),
    );
    setRoleDialogOpen(false);
  };

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

  const overviewData: WorkspaceOverview = {
    name: workspaceOverview.name,
    description: workspaceOverview.description,
    logoLabel: workspaceOverview.logoLabel,
    status: workspaceOverview.status,
    ownerName: workspaceOverview.ownerName,
    ownerEmail: workspaceOverview.ownerEmail,
    memberCount: workspaceOverview.memberCount,
    projectCount: workspaceOverview.projectCount,
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Workspace
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Manage your workspace
            </h1>
          </div>
          <Button onClick={() => setInviteDialogOpen(true)}>
            Invite member
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: "overview", label: "Overview" },
            { key: "members", label: "Members" },
            { key: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() =>
                setActiveTab(tab.key as "overview" | "members" | "settings")
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <WorkspaceHeader workspace={overviewData} />

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
                    <span>Owner</span>
                    <span className="font-medium text-foreground">
                      {workspaceOverview.ownerName}
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
                      {workspaceOverview.projectCount}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

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

        {activeTab === "settings" ? (
          <WorkspaceSettings workspace={overviewData} />
        ) : null}

        <InviteMemberDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          onInviteSent={handleInviteSent}
        />

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <span className="font-medium">Workspace controls</span>
            <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
              Invite
            </Button>
          </div>
        </div>

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

        <RemoveMemberDialog
          member={selectedMember}
          open={removeDialogOpen}
          onOpenChange={setRemoveDialogOpen}
          onConfirm={handleRemoveMember}
        />
      </div>
    </AppShell>
  );
}
