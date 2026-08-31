import { apiClient } from "@/lib/api/client";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_COMMENT"
  | "TASK_DELETED"
  | "WORKSPACE_INVITATION"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_MEMBER_REMOVED"
  | "PROJECT_ROLE_UPDATED";

export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export function getNotifications(accessToken: string) {
  return apiClient<NotificationRecord[]>("/api/v1/notifications", {
    method: "GET",
    accessToken,
    expectedStatuses: 200,
  });
}

export function markNotificationAsRead(
  accessToken: string,
  notificationId: string,
) {
  return apiClient<NotificationRecord>(
    `/api/v1/notifications/${encodeURIComponent(notificationId)}/read`,
    {
      method: "PATCH",
      accessToken,
      expectedStatuses: 200,
    },
  );
}

export function markAllNotificationsAsRead(accessToken: string) {
  return apiClient<null>("/api/v1/notifications/read-all", {
    method: "PATCH",
    accessToken,
    expectedStatuses: 200,
  });
}

export function deleteNotification(
  accessToken: string,
  notificationId: string,
) {
  return apiClient<null>(
    `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
    {
      method: "DELETE",
      accessToken,
      expectedStatuses: 200,
    },
  );
}
