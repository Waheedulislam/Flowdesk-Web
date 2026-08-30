"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import {
  getWorkspaceActivity,
  type ActivityLog,
  type ActivityPagination,
} from "@/lib/api/activity.api";

type UseActivityOptions = {
  limit?: number;
};

const defaultMeta: ActivityPagination = { page: 1, limit: 10, total: 0 };

export function useActivity({ limit = 10 }: UseActivityOptions = {}) {
  const { accessToken, isReady } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const workspaceId = activeWorkspace?.id;
  const [data, setData] = React.useState<ActivityLog[]>([]);
  const [meta, setMeta] = React.useState<ActivityPagination>({
    ...defaultMeta,
    limit,
  });
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    if (!isReady || !accessToken || !workspaceId) {
      setData([]);
      setMeta({ ...defaultMeta, limit });
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getWorkspaceActivity(accessToken, workspaceId, {
        page,
        limit,
      });
      if (requestId.current !== id) return;
      setData(response.data);
      setMeta(response.meta);
    } catch {
      if (requestId.current === id) {
        setData([]);
        setError("We couldn't load activity right now. Please try again.");
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, limit, page, workspaceId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => setPage(1), 0);
    return () => window.clearTimeout(timeoutId);
  }, [workspaceId]);

  return {
    data,
    meta,
    page,
    loading,
    error,
    hasNextPage: page * meta.limit < meta.total,
    hasPreviousPage: page > 1,
    setPage,
    reload,
  };
}
