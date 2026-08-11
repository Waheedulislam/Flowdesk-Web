import type { TaskPriority, TaskStatus } from "@/lib/dashboard-data";

export interface TaskComment {
  id: string;
  author: string;
  message: string;
  time: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTone: "upcoming" | "soon" | "overdue" | "done";
  comments: number;
  attachments: number;
  createdAt: string;
  updatedAt: string;
  commentsList: TaskComment[];
  attachmentsList: TaskAttachment[];
}

// TODO: Replace with backend task data once the task API is available.
export const mockTasks: TaskItem[] = [
  {
    id: "task-1",
    title: "Refine onboarding flow",
    description:
      "Polish the experience for first-time users across the web app.",
    project: "Apollo Web Redesign",
    assignee: "Nina Patel",
    assigneeInitials: "NP",
    status: "TODO",
    priority: "HIGH",
    dueDate: "Aug 16, 2026",
    dueTone: "soon",
    comments: 3,
    attachments: 2,
    createdAt: "Jul 12, 2026",
    updatedAt: "Jul 14, 2026",
    commentsList: [
      {
        id: "c1",
        author: "Nina Patel",
        message: "I can review the copy in the morning.",
        time: "10m ago",
      },
    ],
    attachmentsList: [
      {
        id: "a1",
        name: "Onboarding-v2.fig",
        type: "Figma",
        size: "4.8 MB",
        uploadedBy: "Ada",
      },
    ],
  },
  {
    id: "task-2",
    title: "Prepare launch review",
    description:
      "Collect final notes and package the rollout for stakeholders.",
    project: "Atlas Mobile App",
    assignee: "Jun Kim",
    assigneeInitials: "JK",
    status: "IN_PROGRESS",
    priority: "URGENT",
    dueDate: "Aug 12, 2026",
    dueTone: "overdue",
    comments: 5,
    attachments: 1,
    createdAt: "Jul 08, 2026",
    updatedAt: "Jul 11, 2026",
    commentsList: [],
    attachmentsList: [
      {
        id: "a2",
        name: "Launch-checklist.pdf",
        type: "PDF",
        size: "1.2 MB",
        uploadedBy: "Mina",
      },
    ],
  },
  {
    id: "task-3",
    title: "Review analytics dashboard",
    description:
      "Ensure the executive reporting view is consistent and responsive.",
    project: "Orbit Analytics",
    assignee: "Dylan Cruz",
    assigneeInitials: "DC",
    status: "IN_REVIEW",
    priority: "MEDIUM",
    dueDate: "Aug 22, 2026",
    dueTone: "upcoming",
    comments: 2,
    attachments: 3,
    createdAt: "Jun 29, 2026",
    updatedAt: "Jul 09, 2026",
    commentsList: [],
    attachmentsList: [],
  },
  {
    id: "task-4",
    title: "Close out design system audit",
    description: "Mark the final component checks complete and share outcomes.",
    project: "Nova Design System",
    assignee: "Tara Brooks",
    assigneeInitials: "TB",
    status: "DONE",
    priority: "LOW",
    dueDate: "Aug 01, 2026",
    dueTone: "done",
    comments: 1,
    attachments: 0,
    createdAt: "Jun 18, 2026",
    updatedAt: "Jun 27, 2026",
    commentsList: [
      {
        id: "c2",
        author: "Tara Brooks",
        message: "Completed and shared the QA notes.",
        time: "4h ago",
      },
    ],
    attachmentsList: [],
  },
];

export const taskStatuses: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];
export const taskPriorities: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];
