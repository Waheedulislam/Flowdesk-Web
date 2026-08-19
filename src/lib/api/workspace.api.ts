import { apiClient } from "@/lib/api/client";

export type WorkspaceStatus = "ACTIVE" | "ARCHIVED";
export type WorkspaceMemberRole = "OWNER" | "ADMIN" | "MEMBER" | "GUEST";

/** Workspace shape returned by `GET /api/v1/workspaces`. */
export type WorkspaceRecord = {
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

export type CreateInvitationPayload = {
  email: string;
  role: WorkspaceMemberRole;
};

export type InvitationRecord = {
  id: string;
  workspaceId: string;
  invitedBy: string;
  email: string;
  role: WorkspaceMemberRole;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  invitedBy: string;
  email: string;
  role: WorkspaceMemberRole;
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELLED";
  token: string;
  expiresAt: string;
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
  return apiClient<WorkspaceDetail>(
    `/api/v1/workspaces/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      accessToken,
      expectedStatuses: 200,
    },
  );
}
export type WorkspaceMemberRecord = {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    designation: string | null;
    jobTitle: string | null;
    status: string;
  };
};

export function getWorkspaceMembers(accessToken: string, workspaceId: string) {
  return apiClient<WorkspaceMemberRecord[]>(
    `/api/v1/workspaces/${workspaceId}/members`,
    {
      method: "GET",
      accessToken,
      expectedStatuses: 200,
    },
  );
}
export function createWorkspace(
  accessToken: string,
  payload: CreateWorkspacePayload,
) {
  return apiClient<WorkspaceRecord>("/api/v1/workspaces/create-workspaces", {
    method: "POST",
    accessToken,
    body: payload,
    expectedStatuses: 201,
  });
}

export type UpdateMemberRolePayload = {
  role: WorkspaceMemberRole;
};

export function createInvitation(
  accessToken: string,
  workspaceId: string,
  payload: CreateInvitationPayload,
) {
  return apiClient<InvitationRecord>(
    `/api/v1/invitations/workspace/${workspaceId}`,
    {
      method: "POST",
      accessToken,
      body: payload,
      expectedStatuses: 201,
    },
  );
}

export function getWorkspaceInvitations(
  accessToken: string,
  workspaceId: string,
) {
  return apiClient<WorkspaceInvitation[]>(
    `/api/v1/invitations/workspace/${workspaceId}`,
    {
      method: "GET",
      accessToken,
      expectedStatuses: 200,
    },
  );
}

export function acceptInvitation(accessToken: string, token: string) {
  return apiClient<WorkspaceInvitation>(
    `/api/v1/invitations/workspace/${encodeURIComponent(token)}/accept`,
    {
      method: "POST",
      accessToken,
      expectedStatuses: 200,
    },
  );
}

export function cancelInvitation(
  accessToken: string,
  workspaceId: string,
  invitationId: string,
) {
  return apiClient<WorkspaceInvitation>(
    `/api/v1/invitations/workspace/${workspaceId}/${invitationId}`,
    {
      method: "DELETE",
      accessToken,
      expectedStatuses: 200,
    },
  );
}
export function updateMemberRole(
  accessToken: string,
  workspaceId: string,
  memberId: string,
  payload: UpdateMemberRolePayload,
) {
  return apiClient(
    `/api/v1/workspaces/${workspaceId}/members/${memberId}/role`,
    {
      method: "PATCH",
      accessToken,
      body: payload,
      expectedStatuses: 200,
    },
  );
}

export function removeMember(
  accessToken: string,
  workspaceId: string,
  memberId: string,
) {
  return apiClient(`/api/v1/workspaces/${workspaceId}/members/${memberId}`, {
    method: "DELETE",
    accessToken,
    expectedStatuses: 200,
  });
}

export function leaveWorkspace(accessToken: string, workspaceId: string) {
  return apiClient(`/api/v1/workspaces/${workspaceId}/leave`, {
    method: "POST",
    accessToken,
    expectedStatuses: 200,
  });
}
