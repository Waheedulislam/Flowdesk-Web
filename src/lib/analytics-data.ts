import type { Tone } from "./dashboard-data";

export interface WorkspaceAnalytics {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalMembers: number;
  overdueTasks: number;
  completionRate: number; // percent
}

export interface ProjectAnalytics {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
}

export interface MemberAnalytics {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
}

export const workspaceAnalytics: WorkspaceAnalytics = {
  totalProjects: 12,
  totalTasks: 248,
  completedTasks: 176,
  inProgressTasks: 42,
  todoTasks: 22,
  totalMembers: 24,
  overdueTasks: 8,
  completionRate: 71,
};

export const projectAnalytics: ProjectAnalytics[] = [
  {
    projectId: "p1",
    projectName: "Pulse Marketing Site",
    totalTasks: 36,
    completedTasks: 23,
    inProgressTasks: 8,
    todoTasks: 5,
    completionRate: 64,
  },
  {
    projectId: "p2",
    projectName: "Auth Flow Overhaul",
    totalTasks: 18,
    completedTasks: 12,
    inProgressTasks: 4,
    todoTasks: 2,
    completionRate: 66,
  },
  {
    projectId: "p3",
    projectName: "Mobile App Revamp Long Project Name",
    totalTasks: 48,
    completedTasks: 38,
    inProgressTasks: 6,
    todoTasks: 4,
    completionRate: 79,
  },
];

export const memberAnalytics: MemberAnalytics[] = [
  {
    userId: "u1",
    name: "Grace Hopper",
    email: "grace@flowdesk.io",
    totalTasks: 34,
    completedTasks: 28,
    inProgressTasks: 4,
    todoTasks: 2,
    completionRate: 82,
  },
  {
    userId: "u2",
    name: "Alan Turing",
    email: "alan@flowdesk.io",
    totalTasks: 26,
    completedTasks: 17,
    inProgressTasks: 6,
    todoTasks: 3,
    completionRate: 65,
  },
  {
    userId: "u3",
    name: "Katherine Johnson",
    email: "katherine@flowdesk.io",
    totalTasks: 18,
    completedTasks: 12,
    inProgressTasks: 4,
    todoTasks: 2,
    completionRate: 67,
  },
];

export const taskDistribution = {
  TODO: 22,
  IN_PROGRESS: 42,
  IN_REVIEW: 8,
  DONE: 176,
  OVERDUE: 8,
};

export const completionTrend = [5, 8, 12, 18, 26, 34, 41, 52, 63, 72, 80, 176];

// TODO: Connect analytics APIs

export interface OverdueTask {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  dueDate: string;
  daysOverdue: number;
}

export const overdueTasks: OverdueTask[] = [
  {
    id: "ot1",
    title: "Fix login redirect bug",
    project: "Auth Flow Overhaul",
    assignee: "Alan Turing",
    priority: "High",
    dueDate: "2026-08-05",
    daysOverdue: 6,
  },
  {
    id: "ot2",
    title: "Finalize hero assets",
    project: "Pulse Marketing Site",
    assignee: "Grace Hopper",
    priority: "Medium",
    dueDate: "2026-08-07",
    daysOverdue: 4,
  },
  {
    id: "ot3",
    title: "Resolve payment gateway errors",
    project: "Atlas Mobile App",
    assignee: "Katherine Johnson",
    priority: "Urgent",
    dueDate: "2026-08-01",
    daysOverdue: 10,
  },
];
