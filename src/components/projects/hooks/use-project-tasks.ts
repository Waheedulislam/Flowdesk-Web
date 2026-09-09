"use client";

import * as React from "react";
import { getProjectTasks, type TaskRecord } from "@/lib/api/task.api";

type Options = {
  accessToken: string | null;
  isReady: boolean;
  projectId: string;
};

export function useProjectTasks({ accessToken, isReady, projectId }: Options) {
  const [tasks, setTasks] = React.useState<TaskRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    setTasks([]);
    if (!isReady || !accessToken || !projectId) {
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getProjectTasks(accessToken, projectId);
      if (requestId.current === id) setTasks(response.data);
    } catch (requestError) {
      if (requestId.current === id) {
        setTasks([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load project tasks.",
        );
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, projectId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  return { tasks, loading, error, reload };
}
