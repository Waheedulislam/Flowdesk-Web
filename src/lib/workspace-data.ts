import type { LucideIcon } from "lucide-react";
import { Briefcase, ShieldCheck, Users } from "lucide-react";

export type MemberRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";
export type InvitationStatus = "Pending" | "Accepted" | "Expired";

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
  status: "Active" | "Invited" | "Pending";
  avatarUrl?: string;
}

export interface WorkspaceInvitation {
  id: string;
  email: string;
  role: MemberRole;
  status: InvitationStatus;
  sentAt: string;
  expiresAt: string;
}

export interface WorkspaceStatsItem {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

export interface WorkspaceActivityItem {
  id: string;
  title: string;
  actor: string;
  time: string;
  detail: string;
}

export const workspaceOverview = {
  name: "FlowDesk Core",
  description:
    "A focused workspace for delivery, collaboration, and executive visibility across the product team.",
  logoLabel: "FC",
  status: "Healthy",
  ownerName: "Ada Lovelace",
  ownerEmail: "ada@flowdesk.io",
  memberCount: 24,
  projectCount: 8,
};

export const workspaceStats: WorkspaceStatsItem[] = [
  {
    title: "Members",
    value: "24",
    detail: "7 active this week",
    icon: Users,
  },
  {
    title: "Projects",
    value: "8",
    detail: "3 on track",
    icon: Briefcase,
  },
  {
    title: "Health",
    value: "94%",
    detail: "Stable delivery rhythm",
    icon: ShieldCheck,
  },
];

export const workspaceActivity: WorkspaceActivityItem[] = [
  {
    id: "a1",
    title: "Quarterly planning shared",
    actor: "Nina",
    time: "10 min ago",
    detail: "The roadmap and milestones were posted for review.",
  },
  {
    id: "a2",
    title: "Role updated",
    actor: "Ada",
    time: "1 hr ago",
    detail: "Dylan was promoted to Admin for launch coordination.",
  },
  {
    id: "a3",
    title: "New project created",
    actor: "Mina",
    time: "Today",
    detail: "A new onboarding workspace was added to the portfolio.",
  },
];

// TODO: Replace mock workspace members with data from the workspace members API.
export const initialMembers: WorkspaceMember[] = [
  {
    id: "m1",
    name: "Ada Lovelace",
    email: "ada@flowdesk.io",
    role: "OWNER",
    joinedAt: "Jan 03, 2024",
    status: "Active",
  },
  {
    id: "m2",
    name: "Noah Chen",
    email: "noah@flowdesk.io",
    role: "ADMIN",
    joinedAt: "Feb 11, 2024",
    status: "Active",
  },
  {
    id: "m3",
    name: "Lina Patel",
    email: "lina@flowdesk.io",
    role: "MEMBER",
    joinedAt: "Mar 18, 2024",
    status: "Active",
  },
  {
    id: "m4",
    name: "Marek Ortiz",
    email: "marek@flowdesk.io",
    role: "GUEST",
    joinedAt: "Apr 09, 2024",
    status: "Pending",
  },
];

// TODO: Replace mock invitations with data from the invitation API.
export const initialInvitations: WorkspaceInvitation[] = [
  {
    id: "i1",
    email: "zoe@flowdesk.io",
    role: "MEMBER",
    status: "Pending",
    sentAt: "Jul 01, 2026",
    expiresAt: "Jul 15, 2026",
  },
  {
    id: "i2",
    email: "dylan@flowdesk.io",
    role: "ADMIN",
    status: "Accepted",
    sentAt: "Jun 20, 2026",
    expiresAt: "Jul 04, 2026",
  },
  {
    id: "i3",
    email: "nina@flowdesk.io",
    role: "GUEST",
    status: "Expired",
    sentAt: "Jun 10, 2026",
    expiresAt: "Jun 24, 2026",
  },
];

export const roleDescriptions: Record<MemberRole, string> = {
  OWNER: "Full access to workspace settings, billing, and member management.",
  ADMIN: "Can manage members, invitations, and workspace configuration.",
  MEMBER: "Can collaborate on projects and participate in assigned work.",
  GUEST: "Can view shared items without editing workspace settings.",
};

export const roleOptions: MemberRole[] = ["OWNER", "ADMIN", "MEMBER", "GUEST"];
