import { apiClient } from "@/lib/api/client";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";

export type ProjectRecord = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetail = ProjectRecord & {
  creator: { id: string; name: string; email: string; avatar: string | null };
};

export type CreateProjectPayload = { name: string; description?: string };
export type UpdateProjectPayload = Partial<Pick<ProjectRecord, "name" | "description" | "status">>;

export function getProjects(accessToken: string, workspaceId: string) {
  return apiClient<ProjectRecord[]>(`/api/v1/projects/workspace/${encodeURIComponent(workspaceId)}`, { method: "GET", accessToken, expectedStatuses: 200 });
}

export function getProject(accessToken: string, projectId: string) {
  return apiClient<ProjectDetail>(`/api/v1/projects/${encodeURIComponent(projectId)}`, { method: "GET", accessToken, expectedStatuses: 200 });
}

export function createProject(accessToken: string, workspaceId: string, payload: CreateProjectPayload) {
  return apiClient<ProjectRecord>(`/api/v1/projects/workspace/${encodeURIComponent(workspaceId)}`, { method: "POST", accessToken, body: payload, expectedStatuses: 201 });
}

export function updateProject(accessToken: string, projectId: string, payload: UpdateProjectPayload) {
  return apiClient<ProjectRecord>(`/api/v1/projects/${encodeURIComponent(projectId)}`, { method: "PATCH", accessToken, body: payload, expectedStatuses: 200 });
}

export function deleteProject(accessToken: string, projectId: string) {
  return apiClient<null>(`/api/v1/projects/${encodeURIComponent(projectId)}`, { method: "DELETE", accessToken, expectedStatuses: 200 });
}
