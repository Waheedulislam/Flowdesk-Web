import { apiClient } from "@/lib/api/client";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export type TaskRecord = {
  id: string;
  title: string;
  description: string | null;
  projectId: string;
  assignedTo: string | null;
  createdBy: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  creator?: TaskUser;
  assignee?: TaskUser | null;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
};

export type UpdateTaskPayload = Partial<
  Pick<
    TaskRecord,
    | "title"
    | "description"
    | "assignedTo"
    | "priority"
    | "status"
    | "dueDate"
    | "order"
  >
>;

export function getProjectTasks(accessToken: string, projectId: string) {
  return apiClient<TaskRecord[]>(
    `/api/v1/tasks/project/${encodeURIComponent(projectId)}`,
    { method: "GET", accessToken, expectedStatuses: 200 },
  );
}

export function getTask(accessToken: string, taskId: string) {
  return apiClient<TaskRecord>(`/api/v1/tasks/${encodeURIComponent(taskId)}`, {
    method: "GET",
    accessToken,
    expectedStatuses: 200,
  });
}

export function createTask(
  accessToken: string,
  projectId: string,
  payload: CreateTaskPayload,
) {
  return apiClient<TaskRecord>(
    `/api/v1/tasks/project/${encodeURIComponent(projectId)}`,
    { method: "POST", accessToken, body: payload, expectedStatuses: 201 },
  );
}

export function updateTask(
  accessToken: string,
  taskId: string,
  payload: UpdateTaskPayload,
) {
  return apiClient<TaskRecord>(`/api/v1/tasks/${encodeURIComponent(taskId)}`, {
    method: "PATCH",
    accessToken,
    body: payload,
    expectedStatuses: 200,
  });
}

export function deleteTask(accessToken: string, taskId: string) {
  return apiClient<null>(`/api/v1/tasks/${encodeURIComponent(taskId)}`, {
    method: "DELETE",
    accessToken,
    expectedStatuses: 200,
  });
}
