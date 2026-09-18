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
  role?: string;
};

export type ActivityProject = {
  id: string;
  name: string;
};

export type ActivityLog = {
  id: string;
  actor: ActivityActor;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId: string;
  metadata: ActivityMetadata;
  createdAt: string;
  description?: string;
  project?: ActivityProject | null;
};

type RawActivityLog = Omit<ActivityLog, "actor" | "metadata"> & {
  actor?: Partial<ActivityActor> | null;
  user?: Partial<ActivityActor> | null;
  userId?: string | null;
  role?: string | null;
  project?: ActivityProject | null;
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
    data: response.data.map((activity) => {
      const actor = activity.actor ?? activity.user;

      return {
        ...activity,
        actor: {
          id: actor?.id ?? activity.userId ?? "",
          name: actor?.name ?? "Workspace member",
          email: actor?.email ?? "",
          avatar: actor?.avatar ?? null,
          role:
            actor?.role ?? activity.user?.role ?? activity.role ?? undefined,
        },
        metadata: activity.metadata ?? null,
      };
    }),
  }));
}
