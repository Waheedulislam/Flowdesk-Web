"use client";

import * as React from "react";
import { getProject, type ProjectDetail } from "@/lib/api/project.api";

type Options = {
  accessToken: string | null;
  isReady: boolean;
  projectId: string;
  workspaceId: string;
};

export function useProjectDetail({
  accessToken,
  isReady,
  projectId,
  workspaceId,
}: Options) {
  const [project, setProject] = React.useState<ProjectDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    setProject(null);
    if (!isReady || !accessToken || !projectId || !workspaceId) {
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getProject(accessToken, projectId);
      if (requestId.current === id) setProject(response.data);
    } catch (requestError) {
      if (requestId.current === id) {
        setProject(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load the project.",
        );
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, projectId, workspaceId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  return { project, loading, error, reload, setProject };
}
