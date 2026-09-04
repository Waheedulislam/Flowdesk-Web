"use client";

import * as React from "react";
import {
  getWorkspaceAnalytics,
  type WorkspaceAnalytics,
} from "@/lib/api/analytics.api";

const emptyAnalytics: WorkspaceAnalytics = {
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  inProgressTasks: 0,
  todoTasks: 0,
  totalMembers: 0,
  overdueTasks: 0,
  completionRate: 0,
};

export function useWorkspaceOverviewAnalytics({
  accessToken,
  isReady,
  workspaceId,
}: {
  accessToken: string | null;
  isReady: boolean;
  workspaceId?: string;
}) {
  const [data, setData] = React.useState<WorkspaceAnalytics>(emptyAnalytics);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    if (!isReady || !accessToken || !workspaceId) {
      setData(emptyAnalytics);
      setLoading(false);
      setError(null);
      return;
    }

    setData(emptyAnalytics);
    setLoading(true);
    setError(null);
    try {
      const response = await getWorkspaceAnalytics(accessToken, workspaceId);
      if (requestId.current === id) setData(response.data);
    } catch (cause) {
      if (requestId.current === id) {
        setData(emptyAnalytics);
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to load workspace overview metrics.",
        );
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, workspaceId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => {
      window.clearTimeout(timeoutId);
      requestId.current += 1;
    };
  }, [reload]);

  return { data, loading, error, reload };
}
