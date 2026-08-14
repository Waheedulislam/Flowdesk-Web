import { apiClient } from "@/lib/api/client";

export type WorkspaceStatus = "ACTIVE" | "ARCHIVED";
export type WorkspaceMemberRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";

/** Workspace shape returned by `GET /api/v1/workspaces`. */
type WorkspaceRecord = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status: WorkspaceStatus;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

/** Workspace shape returned by `GET /api/v1/workspaces`. */
export type Workspace = WorkspaceRecord & {
  role: WorkspaceMemberRole;
};

/** `GET /api/v1/workspaces/:slug` adds the workspace owner. */
export type WorkspaceDetail = Workspace & {
  owner: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
};

export type CreateWorkspacePayload = {
  name: string;
  description?: string;
  logo?: string;
};

export function getWorkspaces(accessToken: string) {
  return apiClient<Workspace[]>("/api/v1/workspaces", {
    method: "GET",
    accessToken,
    expectedStatuses: 200,
  });
}

export function getWorkspaceBySlug(accessToken: string, slug: string) {
  return apiClient<WorkspaceDetail>(`/api/v1/workspaces/${encodeURIComponent(slug)}`, {
    method: "GET",
    accessToken,
    expectedStatuses: 200,
  });
}

export function createWorkspace(accessToken: string, payload: CreateWorkspacePayload) {
  return apiClient<WorkspaceRecord>("/api/v1/workspaces/create-workspaces", {
    method: "POST",
    accessToken,
    body: payload,
    expectedStatuses: 201,
  });
}
