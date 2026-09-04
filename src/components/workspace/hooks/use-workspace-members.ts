"use client";

import * as React from "react";

import {
  getWorkspaceMembers,
  type WorkspaceMemberRecord,
} from "@/lib/api/workspace.api";

type Options = {
  accessToken: string | null;
  isReady: boolean;
  workspaceId: string | undefined;
};

export function useWorkspaceMembers({
  accessToken,
  isReady,
  workspaceId,
}: Options) {
  const [members, setMembers] = React.useState<WorkspaceMemberRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    if (!isReady || !accessToken || !workspaceId) {
      setMembers([]);
      setLoading(false);
      setError(null);
      return;
    }
    const id = ++requestId.current;
    setMembers([]);
    setLoading(true);
    setError(null);
    try {
      const response = await getWorkspaceMembers(accessToken, workspaceId);
      if (id === requestId.current) setMembers(response.data);
    } catch (requestError) {
      if (id === requestId.current) {
        setMembers([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load workspace members.",
        );
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [accessToken, isReady, workspaceId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  return { members, setMembers, loading, error, reload };
}
