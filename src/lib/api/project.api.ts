import { apiClient } from "@/lib/api/client";

export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "ARCHIVED";
export type ProjectRole = "PROJECT_ADMIN" | "DEVELOPER" | "VIEWER";

export type ProjectRecord = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
};

export type ProjectDetail = ProjectRecord & {
  creator: NonNullable<ProjectRecord["creator"]>;
};

export type ProjectMemberRecord = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
};

export type AddProjectMemberPayload = {
  userId: string;
  role: ProjectRole;
};

export type ProjectMemberRoleUpdate = Pick<
  ProjectMemberRecord,
  "id" | "projectId" | "userId" | "role" | "joinedAt"
>;

export type CreateProjectPayload = { name: string; description?: string };
export type UpdateProjectPayload = Partial<
  Pick<ProjectRecord, "name" | "description" | "status">
>;

export function getProjects(accessToken: string, workspaceId: string) {
  return apiClient<ProjectRecord[]>(
    `/api/v1/projects/workspace/${encodeURIComponent(workspaceId)}`,
    { method: "GET", accessToken, expectedStatuses: 200 },
  );
}

export function getProject(accessToken: string, projectId: string) {
  return apiClient<ProjectDetail>(
    `/api/v1/projects/${encodeURIComponent(projectId)}`,
    { method: "GET", accessToken, expectedStatuses: 200 },
  );
}

export function createProject(
  accessToken: string,
  workspaceId: string,
  payload: CreateProjectPayload,
) {
  return apiClient<ProjectRecord>(
    `/api/v1/projects/workspace/${encodeURIComponent(workspaceId)}`,
    { method: "POST", accessToken, body: payload, expectedStatuses: 201 },
  );
}

export function updateProject(
  accessToken: string,
  projectId: string,
  payload: UpdateProjectPayload,
) {
  return apiClient<ProjectRecord>(
    `/api/v1/projects/${encodeURIComponent(projectId)}`,
    { method: "PATCH", accessToken, body: payload, expectedStatuses: 200 },
  );
}

export function deleteProject(accessToken: string, projectId: string) {
  return apiClient<null>(`/api/v1/projects/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
    accessToken,
    expectedStatuses: 200,
  });
}

export function getProjectMembers(accessToken: string, projectId: string) {
  return apiClient<ProjectMemberRecord[]>(
    `/api/v1/projects/${encodeURIComponent(projectId)}/members`,
    { method: "GET", accessToken, expectedStatuses: 200 },
  );
}

export function addProjectMember(
  accessToken: string,
  projectId: string,
  payload: AddProjectMemberPayload,
) {
  return apiClient<ProjectMemberRecord>(
    `/api/v1/projects/${encodeURIComponent(projectId)}/members`,
    { method: "POST", accessToken, body: payload, expectedStatuses: 201 },
  );
}

export function updateProjectMemberRole(
  accessToken: string,
  memberId: string,
  role: ProjectRole,
) {
  return apiClient<ProjectMemberRoleUpdate>(
    `/api/v1/projects/members/${encodeURIComponent(memberId)}`,
    { method: "PATCH", accessToken, body: { role }, expectedStatuses: 200 },
  );
}

export function removeProjectMember(accessToken: string, memberId: string) {
  return apiClient<null>(
    `/api/v1/projects/members/${encodeURIComponent(memberId)}`,
    { method: "DELETE", accessToken, expectedStatuses: 200 },
  );
}
