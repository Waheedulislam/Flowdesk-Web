"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CancelInvitationDialog } from "@/components/workspace/cancel-invitation-dialog";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { RemoveMemberDialog } from "@/components/workspace/remove-member-dialog";
import { RoleDialog } from "@/components/workspace/role-dialog";
import { WorkspaceActions } from "@/components/workspace/workspace-actions";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { WorkspaceMembersSection } from "@/components/workspace/workspace-members-section";
import { WorkspaceOverviewSection } from "@/components/workspace/workspace-overview-section";
import { WorkspaceSettings } from "@/components/workspace/workspace-settings";
import { WorkspaceTabs, type WorkspaceTab } from "@/components/workspace/workspace-tabs";
import { useWorkspaceDetail } from "@/components/workspace/hooks/use-workspace-detail";
import { useWorkspaceInvitations } from "@/components/workspace/hooks/use-workspace-invitations";
import { useWorkspaceMembers } from "@/components/workspace/hooks/use-workspace-members";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import type { WorkspaceInvitation, WorkspaceMemberRecord, WorkspaceMemberRole } from "@/lib/api/workspace.api";

export function WorkspacePage() {
  const { accessToken, isReady } = useAuth();
  const { workspaces, activeWorkspace, isLoading, error: workspaceListError, refreshWorkspaces } = useWorkspace();
  const [tab, setTab] = React.useState<WorkspaceTab>("overview");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [memberForRole, setMemberForRole] = React.useState<WorkspaceMemberRecord | null>(null);
  const [memberForRemoval, setMemberForRemoval] = React.useState<WorkspaceMemberRecord | null>(null);
  const [invitationForCancellation, setInvitationForCancellation] = React.useState<WorkspaceInvitation | null>(null);
  const workspaceId = activeWorkspace?.id;
  const role = activeWorkspace?.role;
  const canInvite = role === "OWNER" || role === "ADMIN";
  const detailState = useWorkspaceDetail({ accessToken, isReady, slug: activeWorkspace?.slug });
  const memberState = useWorkspaceMembers({ accessToken, isReady, workspaceId });
  const invitationState = useWorkspaceInvitations({ accessToken, isReady, workspaceId, enabled: canInvite });

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => { setInviteOpen(false); setMemberForRole(null); setMemberForRemoval(null); setInvitationForCancellation(null); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [workspaceId]);

  if (!isReady || isLoading) return <div className="flex min-h-100 items-center justify-center text-sm text-muted-foreground">Loading workspace...</div>;
  const workspaceError = workspaceListError || detailState.error;
  if (workspaceError) return <WorkspaceError message={workspaceError} onRetry={() => void refreshWorkspaces()} />;
  if (!activeWorkspace || workspaces.length === 0) return <><div className="flex min-h-100 items-center justify-center"><Card className="w-full max-w-md"><CardContent className="p-6 text-center"><p className="font-semibold">No workspace found</p><p className="mt-2 text-sm text-muted-foreground">You do not have any workspace yet. Create one to get started.</p><Button className="mt-4" onClick={() => setCreateOpen(true)}>Create workspace</Button></CardContent></Card></div><CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} /></>;

  const headerWorkspace = { name: activeWorkspace.name, description: detailState.detail?.description ?? activeWorkspace.description ?? "", status: detailState.detail?.status ?? activeWorkspace.status, ownerName: detailState.detail?.owner.name ?? "Workspace Owner", ownerEmail: detailState.detail?.owner.email ?? "", memberCount: memberState.members.length, projectCount: 0 };
  const updateMember = (memberId: string, nextRole: WorkspaceMemberRole) => memberState.setMembers((members) => members.map((member) => member.id === memberId ? { ...member, role: nextRole } : member));
  const removeMember = (memberId: string) => { const member = memberState.members.find((item) => item.id === memberId); memberState.setMembers((members) => members.filter((item) => item.id !== memberId)); if (member) toast.success("Member removed successfully", { description: `${member.user.name} has been removed from this workspace.` }); };
  const cancelInvitation = (invitationId: string) => { const invitation = invitationState.invitations.find((item) => item.id === invitationId); invitationState.setInvitations((items) => items.filter((item) => item.id !== invitationId)); if (invitation) toast.success("Invitation cancelled", { description: `Invitation to ${invitation.email} has been cancelled.` }); };

  return <div className="flex min-w-0 flex-col gap-6 pb-16 md:pb-0"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Manage your workspace</h1><p className="mt-2 truncate text-sm text-muted-foreground">{activeWorkspace.name}</p></div><WorkspaceActions canInvite={canInvite} onInvite={() => setInviteOpen(true)} onCreate={() => setCreateOpen(true)} /></div><WorkspaceTabs activeTab={tab} onChange={setTab} /><WorkspaceHeader workspace={headerWorkspace} />{tab === "overview" ? <WorkspaceOverviewSection workspace={activeWorkspace} detail={detailState.detail} members={memberState.members} /> : null}{tab === "members" ? <WorkspaceMembersSection members={memberState.members} membersLoading={memberState.loading} membersError={memberState.error} role={activeWorkspace.role} canInvite={canInvite} invitations={invitationState.invitations} invitationsLoading={invitationState.loading} invitationsError={invitationState.error} onInvite={() => setInviteOpen(true)} onRole={setMemberForRole} onRemove={setMemberForRemoval} onCancel={setInvitationForCancellation} /> : null}{tab === "settings" ? <WorkspaceSettings workspace={headerWorkspace} workspaceId={activeWorkspace.id} userRole={activeWorkspace.role} onWorkspaceLeft={async () => { const next = await refreshWorkspaces(); if (next.length === 0) window.location.assign("/dashboard"); }} /> : null}<InviteMemberDialog open={canInvite && inviteOpen} workspaceId={activeWorkspace.id} onOpenChange={setInviteOpen} onInviteSent={() => void invitationState.reload()} /><CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} /><RoleDialog key={memberForRole?.id ?? "role-dialog"} member={memberForRole} workspaceId={activeWorkspace.id} open={Boolean(memberForRole)} onOpenChange={(open) => { if (!open) setMemberForRole(null); }} onSuccess={updateMember} /><RemoveMemberDialog member={memberForRemoval} workspaceId={activeWorkspace.id} open={Boolean(memberForRemoval)} onOpenChange={(open) => { if (!open) setMemberForRemoval(null); }} onSuccess={removeMember} /><CancelInvitationDialog invitation={invitationForCancellation} workspaceId={activeWorkspace.id} open={Boolean(invitationForCancellation)} onOpenChange={(open) => { if (!open) setInvitationForCancellation(null); }} onSuccess={cancelInvitation} /></div>;
}

function WorkspaceError({ message, onRetry }: { message: string; onRetry: () => void }) { return <div className="flex min-h-100 items-center justify-center"><Card className="w-full max-w-md"><CardContent className="p-6 text-center"><p className="font-semibold">Unable to load workspace</p><p className="mt-2 text-sm text-muted-foreground">{message}</p><Button className="mt-4" onClick={onRetry}>Try again</Button></CardContent></Card></div>; }