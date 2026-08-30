import { apiClient, type ApiResponse } from "@/lib/api/client";

export type ActivityAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "INVITE"
  | "ASSIGNED"
  | "COMMENT"
  | "ADD_MEMBER"
  | "UPDATE_ROLE"
  | "REMOVE_MEMBER"
  | "ASSIGN_TASK"
  | "CHANGE_STATUS"
  | "ACCEPT_INVITATION"
  | "CANCEL_INVITATION"
  | "FILE_UPLOAD"
  | "FILE_DELETE";

export type ActivityEntity =
  | "WORKSPACE"
  | "PROJECT"
  | "PROJECT_MEMBER"
  | "TASK"
  | "COMMENT"
  | "INVITATION"
  | "FILE";

export type ActivityMetadata = Record<string, unknown> | null;

export type ActivityActor = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export type ActivityLog = {
  id: string;
  actor: ActivityActor;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId: string;
  metadata: ActivityMetadata;
  createdAt: string;
};

type RawActivityLog = Omit<ActivityLog, "actor" | "metadata"> & {
  actor?: ActivityActor | null;
  user?: ActivityActor | null;
  metadata?: ActivityMetadata;
};

export type ActivityPagination = {
  page: number;
  limit: number;
  total: number;
};

type ActivityParams = {
  page?: number;
  limit?: number;
};

export function getWorkspaceActivity(
  accessToken: string,
  workspaceId: string,
  params: ActivityParams = {},
): Promise<ApiResponse<ActivityLog[]> & { meta: ActivityPagination }> {
  const searchParams = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });

  return apiClient<RawActivityLog[]>(
    `/api/v1/activity-logs/workspace/${encodeURIComponent(workspaceId)}?${searchParams.toString()}`,
    {
      method: "GET",
      accessToken,
      expectedStatuses: 200,
    },
  ).then((response) => ({
    ...response,
    meta: response.meta as ActivityPagination,
    data: response.data.map((activity) => ({
      ...activity,
      actor: activity.actor ??
        activity.user ?? {
          id: "",
          name: "Workspace member",
          email: "",
          avatar: null,
        },
      metadata: activity.metadata ?? null,
    })),
  }));
}
