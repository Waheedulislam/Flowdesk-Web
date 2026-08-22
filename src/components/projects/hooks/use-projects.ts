"use client";

import * as React from "react";
import { getProjects, type ProjectRecord } from "@/lib/api/project.api";

type Options = { accessToken: string | null; isReady: boolean; workspaceId?: string };

export function useProjects({ accessToken, isReady, workspaceId }: Options) {
  const [data, setData] = React.useState<ProjectRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    if (!isReady || !accessToken || !workspaceId) {
      setData([]); setLoading(false); setError(null); return;
    }
    setData([]); setLoading(true); setError(null);
    try {
      const response = await getProjects(accessToken, workspaceId);
      if (requestId.current === id) setData(response.data);
    } catch (cause) {
      if (requestId.current === id) setError(cause instanceof Error ? cause.message : "We couldn't load projects.");
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, workspaceId]);

  React.useEffect(() => { const timeoutId = window.setTimeout(() => void reload(), 0); return () => window.clearTimeout(timeoutId); }, [reload]);
  return { data, loading, error, reload, setData };
}

