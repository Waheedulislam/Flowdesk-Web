import { apiClient } from "@/lib/api/client";

export type WorkspaceAnalytics = {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalMembers: number;
  overdueTasks: number;
  completionRate: number;
};

export type ProjectAnalytics = {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
};

export type MemberAnalytics = {
  userId: string;
  name: string;
  email: string;
  avatar: string | null;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
};

export function getWorkspaceAnalytics(
  accessToken: string,
  workspaceId: string,
) {
  return apiClient<WorkspaceAnalytics>(
    `/api/v1/analytics/workspace/${encodeURIComponent(workspaceId)}`,
    { method: "GET", accessToken, expectedStatuses: 200 },
  );
}

export function getProjectAnalytics(accessToken: string, workspaceId: string) {
  return apiClient<ProjectAnalytics[]>(
    `/api/v1/analytics/projects/${encodeURIComponent(workspaceId)}`,
    { method: "GET", accessToken, expectedStatuses: 200 },
  );
}

export function getMemberAnalytics(accessToken: string, workspaceId: string) {
  return apiClient<MemberAnalytics[]>(
    `/api/v1/analytics/members/${encodeURIComponent(workspaceId)}`,
    { method: "GET", accessToken, expectedStatuses: 200 },
  );
}
