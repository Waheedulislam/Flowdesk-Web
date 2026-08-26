"use client";

import * as React from "react";

import {
  createTask,
  deleteTask,
  getProjectTasks,
  updateTask,
  type CreateTaskPayload,
  type TaskRecord,
  type UpdateTaskPayload,
} from "@/lib/api/task.api";

export type TaskProject = { id: string; name: string };

type Options = {
  accessToken: string | null;
  isReady: boolean;
  projects: TaskProject[];
};

export function useTasks({ accessToken, isReady, projects }: Options) {
  const [tasks, setTasks] = React.useState<TaskRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    if (!isReady || !accessToken || !projects.length) {
      setTasks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setTasks([]);
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.all(
        projects.map((project) => getProjectTasks(accessToken, project.id)),
      );
      if (requestId.current === id) {
        setTasks(responses.flatMap((response) => response.data));
      }
    } catch (requestError) {
      if (requestId.current === id) {
        setTasks([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load tasks.",
        );
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, projects]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  const create = React.useCallback(
    async (projectId: string, payload: CreateTaskPayload) => {
      if (!accessToken)
        throw new Error("Your session is no longer valid. Please try again.");
      const response = await createTask(accessToken, projectId, payload);
      await reload();
      return response.data;
    },
    [accessToken, reload],
  );

  const update = React.useCallback(
    async (taskId: string, payload: UpdateTaskPayload) => {
      if (!accessToken)
        throw new Error("Your session is no longer valid. Please try again.");
      const response = await updateTask(accessToken, taskId, payload);
      await reload();
      return response.data;
    },
    [accessToken, reload],
  );

  const remove = React.useCallback(
    async (taskId: string) => {
      if (!accessToken)
        throw new Error("Your session is no longer valid. Please try again.");
      await deleteTask(accessToken, taskId);
      await reload();
    },
    [accessToken, reload],
  );

  return { tasks, loading, error, reload, create, update, remove };
}
