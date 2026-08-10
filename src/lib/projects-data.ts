import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
  MessageSquare,
  Users,
} from "lucide-react";

import type { ProjectStatus } from "@/lib/dashboard-data";

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatarLabel: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  owner: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  startDate: string;
  dueDate: string;
  color: string;
  visibility: "Private" | "Team" | "Public";
}

export interface ProjectActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
}

export interface ProjectTaskSummary {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  assignee: string;
}

export interface ProjectAnalyticsMetric {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}

// TODO: Replace with backend project enum once available.
export const projectStatuses: ProjectStatus[] = [
  "ON_TRACK",
  "AT_RISK",
  "DELAYED",
  "COMPLETED",
];

// TODO: Connect projects API.
export const mockProjects: ProjectItem[] = [
  {
    id: "prj_apollo",
    name: "Apollo Web Redesign",
    description: "Refining the shared product experience for the launch cycle.",
    status: "ON_TRACK",
    progress: 78,
    totalTasks: 64,
    completedTasks: 50,
    owner: "Ada Lovelace",
    members: [
      { id: "m1", name: "Ada", role: "Owner", avatarLabel: "AL" },
      { id: "m2", name: "Nina", role: "Designer", avatarLabel: "N" },
      { id: "m3", name: "Jun", role: "Developer", avatarLabel: "J" },
    ],
    createdAt: "Jan 02, 2024",
    updatedAt: "Jul 08, 2026",
    startDate: "Jan 05, 2024",
    dueDate: "Sep 12, 2026",
    color: "from-primary/20 to-primary/5",
    visibility: "Team",
  },
  {
    id: "prj_atlas",
    name: "Atlas Mobile App",
    description:
      "Shipping the next iteration of the mobile onboarding experience.",
    status: "AT_RISK",
    progress: 45,
    totalTasks: 52,
    completedTasks: 23,
    owner: "Noah Chen",
    members: [
      { id: "m4", name: "Noah", role: "Lead", avatarLabel: "NC" },
      { id: "m5", name: "Mina", role: "PM", avatarLabel: "M" },
    ],
    createdAt: "Feb 16, 2024",
    updatedAt: "Jul 02, 2026",
    startDate: "Feb 18, 2024",
    dueDate: "Sep 03, 2026",
    color: "from-warning/20 to-warning/5",
    visibility: "Private",
  },
  {
    id: "prj_orbit",
    name: "Orbit Analytics",
    description:
      "Building the executive reporting experience for core stakeholders.",
    status: "DELAYED",
    progress: 32,
    totalTasks: 40,
    completedTasks: 13,
    owner: "Lina Patel",
    members: [
      { id: "m6", name: "Lina", role: "Manager", avatarLabel: "LP" },
      { id: "m7", name: "Dylan", role: "Analyst", avatarLabel: "D" },
    ],
    createdAt: "Mar 14, 2024",
    updatedAt: "Jun 27, 2026",
    startDate: "Mar 20, 2024",
    dueDate: "Aug 28, 2026",
    color: "from-destructive/20 to-destructive/5",
    visibility: "Team",
  },
  {
    id: "prj_nova",
    name: "Nova Design System",
    description: "Supporting the design system rollout and component adoption.",
    status: "COMPLETED",
    progress: 100,
    totalTasks: 28,
    completedTasks: 28,
    owner: "Marek Ortiz",
    members: [
      { id: "m8", name: "Marek", role: "Design", avatarLabel: "MO" },
      { id: "m9", name: "Tara", role: "Frontend", avatarLabel: "T" },
    ],
    createdAt: "Apr 28, 2024",
    updatedAt: "Jun 14, 2026",
    startDate: "May 01, 2024",
    dueDate: "Jul 01, 2026",
    color: "from-success/20 to-success/5",
    visibility: "Public",
  },
];

export const projectActivity: ProjectActivityItem[] = [
  {
    id: "act1",
    title: "Milestone shared",
    detail: "The launch checklist was pushed to the team for review.",
    time: "10m ago",
  },
  {
    id: "act2",
    title: "Task completed",
    detail: "The onboarding flow was approved and closed out.",
    time: "1h ago",
  },
  {
    id: "act3",
    title: "Member added",
    detail: "Mina joined the Apollo team for launch support.",
    time: "2h ago",
  },
];

export const projectTasks: ProjectTaskSummary[] = [
  {
    id: "task1",
    title: "Review onboarding copy",
    status: "DONE",
    assignee: "Nina",
  },
  {
    id: "task2",
    title: "Refine mobile navigation",
    status: "IN_PROGRESS",
    assignee: "Jun",
  },
  {
    id: "task3",
    title: "Prepare executive summary",
    status: "TODO",
    assignee: "Lina",
  },
];

export const projectAnalytics: ProjectAnalyticsMetric[] = [
  {
    label: "Total tasks",
    value: "64",
    hint: "Across the project",
    icon: FolderKanban,
  },
  {
    label: "Completed",
    value: "50",
    hint: "Closed this cycle",
    icon: CheckCircle2,
  },
  { label: "In progress", value: "10", hint: "Currently active", icon: Clock3 },
  { label: "Todo", value: "4", hint: "Ready to start", icon: ListTodo },
];

export const projectOverviewStats = [
  {
    label: "Completion rate",
    value: "78%",
    hint: "Healthy pace",
    icon: BarChart3,
  },
  {
    label: "Active members",
    value: "3",
    hint: "Working on this project",
    icon: Users,
  },
  {
    label: "Updates",
    value: "12",
    hint: "Shared this month",
    icon: MessageSquare,
  },
];
