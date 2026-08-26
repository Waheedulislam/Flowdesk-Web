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
  projectId: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  assigneeId: string | null;
  assigneeAvatar: string | null;
  assigneeInitials: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTone: "upcoming" | "soon" | "overdue" | "done";
  comments: number;
  attachments: number;
  createdAt: string;
  updatedAt: string;
  createdAtValue: string;
  updatedAtValue: string;
  dueDateValue: string | null;
  commentsList: TaskComment[];
  attachmentsList: TaskAttachment[];
}

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
