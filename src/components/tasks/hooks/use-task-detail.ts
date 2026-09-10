"use client";

import * as React from "react";
import { getTask, type TaskRecord } from "@/lib/api/task.api";

type Options = {
  accessToken: string | null;
  isReady: boolean;
  taskId: string;
};

export function useTaskDetail({ accessToken, isReady, taskId }: Options) {
  const [task, setTask] = React.useState<TaskRecord | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    setTask(null);
    if (!isReady || !accessToken || !taskId) {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getTask(accessToken, taskId);
      if (requestId.current === id) setTask(response.data);
    } catch (requestError) {
      if (requestId.current === id) {
        setTask(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load the task.",
        );
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, taskId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => {
      window.clearTimeout(timeoutId);
      requestId.current += 1;
    };
  }, [reload]);

  return { task, loading, error, reload, setTask };
}
