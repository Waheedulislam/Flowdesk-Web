import type { LucideIcon } from "lucide-react";
import {
  FolderKanban,
  ListChecks,
  CircleCheckBig,
  Timer,
  ListTodo,
  TriangleAlert,
  Users,
  Percent,
  MessageSquare,
  UserPlus,
  Paperclip,
  AtSign,
  CircleDot,
} from "lucide-react";

/**
 * FlowDesk dashboard mock data
 * ----------------------------
 * Local, static, presentation-only data for the Phase 3 dashboard UI.
 * Everything here is isolated and easy to swap for real API responses later —
 * the exported types describe the shape each endpoint should return, and each
 * export is marked with a `// TODO: Connect ... API` note.
 *
 * NO fetching, services, or business logic live here on purpose.
 */

/* ------------------------------------------------------------------ */
/* Shared enums / unions                                              */
/* ------------------------------------------------------------------ */

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ProjectStatus = "ON_TRACK" | "AT_RISK" | "DELAYED" | "COMPLETED";

/** Semantic tone reused across cards/badges so colors stay on-palette. */
export type Tone =
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "destructive"
  | "muted";

export type TrendDirection = "up" | "down" | "flat";

/* ------------------------------------------------------------------ */
/* 1. Dashboard header context                                        */
/* ------------------------------------------------------------------ */

export interface DashboardSummary {
  /** Short greeting name for the header. */
  userFirstName: string;
  /** One-line productivity summary shown under the title. */
  headline: string;
  /** Active workspace label echoed in the header. */
  activeWorkspace: string;
  /** Tasks due today, surfaced as quick context. */
  dueToday: number;
}

// TODO: Connect workspace analytics API (header summary)
export const dashboardSummary: DashboardSummary = {
  userFirstName: "Ada",
  headline: "Here's how your workspace is tracking today.",
  activeWorkspace: "FlowDesk Core",
  dueToday: 5,
};

/* ------------------------------------------------------------------ */
/* 2. Overview statistics                                             */
/* ------------------------------------------------------------------ */

export interface StatTrend {
  direction: TrendDirection;
  /** Human label, e.g. "+12% vs last week". */
  label: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  /** Pre-formatted value so cards stay dumb (e.g. "128" or "82%"). */
  value: string;
  /** Small supporting line under the value. */
  hint: string;
  icon: LucideIcon;
  tone: Tone;
  trend?: StatTrend;
}

// TODO: Connect workspace analytics API (overview statistics)
export const dashboardStats: DashboardStat[] = [
  {
    id: "total-projects",
    label: "Total Projects",
    value: "12",
    hint: "3 launching this month",
    icon: FolderKanban,
    tone: "primary",
    trend: { direction: "up", label: "+2 this quarter" },
  },
  {
    id: "total-tasks",
    label: "Total Tasks",
    value: "248",
    hint: "Across all projects",
    icon: ListChecks,
    tone: "info",
    trend: { direction: "up", label: "+18 this week" },
  },
  {
    id: "completed-tasks",
    label: "Completed Tasks",
    value: "176",
    hint: "Last 30 days",
    icon: CircleCheckBig,
    tone: "success",
    trend: { direction: "up", label: "+12% vs last week" },
  },
  {
    id: "in-progress-tasks",
    label: "In Progress",
    value: "42",
    hint: "Currently being worked on",
    icon: Timer,
    tone: "primary",
    trend: { direction: "flat", label: "About the same" },
  },
  {
    id: "todo-tasks",
    label: "Todo Tasks",
    value: "22",
    hint: "Waiting to be picked up",
    icon: ListTodo,
    tone: "muted",
    trend: { direction: "down", label: "-6 vs last week" },
  },
  {
    id: "overdue-tasks",
    label: "Overdue Tasks",
    value: "8",
    hint: "Need attention now",
    icon: TriangleAlert,
    tone: "destructive",
    trend: { direction: "down", label: "-3 vs last week" },
  },
  {
    id: "total-members",
    label: "Total Members",
    value: "24",
    hint: "6 active right now",
    icon: Users,
    tone: "info",
    trend: { direction: "up", label: "+1 this month" },
  },
  {
    id: "completion-rate",
    label: "Completion Rate",
    value: "82%",
    hint: "Rolling 30-day average",
    icon: Percent,
    tone: "success",
    trend: { direction: "up", label: "+4% vs last month" },
  },
];

/* ------------------------------------------------------------------ */
/* 3. Task overview (distribution)                                    */
/* ------------------------------------------------------------------ */

export interface TaskDistributionSlice {
  /** Machine key used for color mapping. */
  key: TaskStatus | "OVERDUE";
  label: string;
  count: number;
  tone: Tone;
}

// TODO: Connect workspace analytics API (task distribution)
export const taskDistribution: TaskDistributionSlice[] = [
  { key: "TODO", label: "To Do", count: 22, tone: "muted" },
  { key: "IN_PROGRESS", label: "In Progress", count: 42, tone: "primary" },
  { key: "IN_REVIEW", label: "In Review", count: 18, tone: "info" },
  { key: "DONE", label: "Done", count: 176, tone: "success" },
  { key: "OVERDUE", label: "Overdue", count: 8, tone: "destructive" },
];

/* ------------------------------------------------------------------ */
/* 4. Project progress                                                */
/* ------------------------------------------------------------------ */

export interface ProjectProgressItem {
  id: string;
  name: string;
  /** 0–100. */
  progress: number;
  totalTasks: number;
  completedTasks: number;
  status: ProjectStatus;
}

// TODO: Connect projects API (project progress)
export const projectProgress: ProjectProgressItem[] = [
  {
    id: "prj_apollo",
    name: "Apollo Web Redesign",
    progress: 78,
    totalTasks: 64,
    completedTasks: 50,
    status: "ON_TRACK",
  },
  {
    id: "prj_atlas",
    name: "Atlas Mobile App",
    progress: 45,
    totalTasks: 52,
    completedTasks: 23,
    status: "AT_RISK",
  },
  {
    id: "prj_orbit",
    name: "Orbit Analytics",
    progress: 32,
    totalTasks: 40,
    completedTasks: 13,
    status: "DELAYED",
  },
  {
    id: "prj_nova",
    name: "Nova Design System",
    progress: 100,
    totalTasks: 28,
    completedTasks: 28,
    status: "COMPLETED",
  },
  {
    id: "prj_pulse",
    name: "Pulse Marketing Site",
    progress: 64,
    totalTasks: 36,
    completedTasks: 23,
    status: "ON_TRACK",
  },
];

/* ------------------------------------------------------------------ */
/* 5. Recent activity                                                 */
/* ------------------------------------------------------------------ */

export type ActivityType =
  | "TASK_COMPLETED"
  | "COMMENT"
  | "MEMBER_JOINED"
  | "FILE_UPLOADED"
  | "MENTION"
  | "TASK_CREATED";

export interface ActivityItemData {
  id: string;
  type: ActivityType;
  actorName: string;
  actorAvatarUrl?: string;
  /** Verb phrase, e.g. "completed". */
  action: string;
  /** Entity the action targeted, e.g. "Design landing hero". */
  target: string;
  /** Pre-formatted relative time, e.g. "12m ago". */
  timestamp: string;
}

/** Icon + tone lookup for each activity type (keeps the component presentational). */
export const activityMeta: Record<ActivityType, { icon: LucideIcon; tone: Tone }> = {
  TASK_COMPLETED: { icon: CircleCheckBig, tone: "success" },
  COMMENT: { icon: MessageSquare, tone: "info" },
  MEMBER_JOINED: { icon: UserPlus, tone: "primary" },
  FILE_UPLOADED: { icon: Paperclip, tone: "muted" },
  MENTION: { icon: AtSign, tone: "warning" },
  TASK_CREATED: { icon: CircleDot, tone: "primary" },
};

// TODO: Connect recent activities API
export const recentActivity: ActivityItemData[] = [
  {
    id: "act_1",
    type: "TASK_COMPLETED",
    actorName: "Grace Hopper",
    action: "completed",
    target: "Design landing hero",
    timestamp: "12m ago",
  },
  {
    id: "act_2",
    type: "COMMENT",
    actorName: "Alan Turing",
    action: "commented on",
    target: "API rate limiting",
    timestamp: "38m ago",
  },
  {
    id: "act_3",
    type: "MENTION",
    actorName: "Katherine Johnson",
    action: "mentioned you in",
    target: "Q3 launch checklist",
    timestamp: "1h ago",
  },
  {
    id: "act_4",
    type: "FILE_UPLOADED",
    actorName: "Linus Torvalds",
    action: "uploaded",
    target: "brand-guidelines.pdf",
    timestamp: "2h ago",
  },
  {
    id: "act_5",
    type: "MEMBER_JOINED",
    actorName: "Radia Perlman",
    action: "joined",
    target: "Atlas Mobile App",
    timestamp: "3h ago",
  },
  {
    id: "act_6",
    type: "TASK_CREATED",
    actorName: "Barbara Liskov",
    action: "created",
    target: "Set up CI pipeline",
    timestamp: "5h ago",
  },
];

/* ------------------------------------------------------------------ */
/* 6. Recent notifications                                            */
/* ------------------------------------------------------------------ */

export type NotificationType = "MENTION" | "ASSIGNMENT" | "DUE_SOON" | "SYSTEM";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

/** Tone lookup keeps notification accents on-palette. */
export const notificationTone: Record<NotificationType, Tone> = {
  MENTION: "warning",
  ASSIGNMENT: "primary",
  DUE_SOON: "destructive",
  SYSTEM: "info",
};

// TODO: Connect notification API
export const recentNotifications: NotificationItem[] = [
  {
    id: "ntf_1",
    type: "MENTION",
    title: "Katherine mentioned you",
    message: "“Can you review the Q3 launch checklist?”",
    read: false,
    timestamp: "1h ago",
  },
  {
    id: "ntf_2",
    type: "ASSIGNMENT",
    title: "New task assigned",
    message: "You were assigned “Finalize pricing page copy”.",
    read: false,
    timestamp: "2h ago",
  },
  {
    id: "ntf_3",
    type: "DUE_SOON",
    title: "Task due soon",
    message: "“Ship auth flow” is due tomorrow.",
    read: false,
    timestamp: "4h ago",
  },
  {
    id: "ntf_4",
    type: "SYSTEM",
    title: "Weekly report ready",
    message: "Your workspace summary for last week is available.",
    read: true,
    timestamp: "1d ago",
  },
];

/* ------------------------------------------------------------------ */
/* 7. Upcoming tasks                                                  */
/* ------------------------------------------------------------------ */

export interface UpcomingTask {
  id: string;
  title: string;
  project: string;
  assigneeName: string;
  assigneeAvatarUrl?: string;
  priority: TaskPriority;
  /** Pre-formatted due label, e.g. "Tomorrow" or "Aug 14". */
  dueLabel: string;
  status: TaskStatus;
  /** True when the due date has already passed. */
  overdue: boolean;
}

/** Tone lookup for priority pills. */
export const priorityTone: Record<TaskPriority, Tone> = {
  LOW: "muted",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "destructive",
};

/** Label + tone for task status, reused by upcoming tasks and elsewhere. */
export const taskStatusMeta: Record<TaskStatus, { label: string; tone: Tone }> = {
  TODO: { label: "To Do", tone: "muted" },
  IN_PROGRESS: { label: "In Progress", tone: "primary" },
  IN_REVIEW: { label: "In Review", tone: "info" },
  DONE: { label: "Done", tone: "success" },
};

// TODO: Connect upcoming tasks API
export const upcomingTasks: UpcomingTask[] = [
  {
    id: "tsk_1",
    title: "Ship auth flow",
    project: "Atlas Mobile App",
    assigneeName: "Alan Turing",
    priority: "URGENT",
    dueLabel: "Overdue · Aug 8",
    status: "IN_PROGRESS",
    overdue: true,
  },
  {
    id: "tsk_2",
    title: "Finalize pricing page copy",
    project: "Pulse Marketing Site",
    assigneeName: "Ada Lovelace",
    priority: "HIGH",
    dueLabel: "Tomorrow",
    status: "TODO",
    overdue: false,
  },
  {
    id: "tsk_3",
    title: "Review Q3 launch checklist",
    project: "Apollo Web Redesign",
    assigneeName: "Katherine Johnson",
    priority: "HIGH",
    dueLabel: "Aug 12",
    status: "IN_REVIEW",
    overdue: false,
  },
  {
    id: "tsk_4",
    title: "Set up CI pipeline",
    project: "Orbit Analytics",
    assigneeName: "Barbara Liskov",
    priority: "MEDIUM",
    dueLabel: "Aug 14",
    status: "TODO",
    overdue: false,
  },
  {
    id: "tsk_5",
    title: "Polish onboarding empty states",
    project: "Nova Design System",
    assigneeName: "Grace Hopper",
    priority: "LOW",
    dueLabel: "Aug 16",
    status: "TODO",
    overdue: false,
  },
];
