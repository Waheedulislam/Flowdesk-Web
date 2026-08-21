"use client";

import * as React from "react";

import { getWorkspaceInvitations, type WorkspaceInvitation } from "@/lib/api/workspace.api";

type Options = { accessToken: string | null; isReady: boolean; workspaceId: string | undefined; enabled: boolean };

export function useWorkspaceInvitations({ accessToken, isReady, workspaceId, enabled }: Options) {
  const [invitations, setInvitations] = React.useState<WorkspaceInvitation[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    if (!enabled || !isReady || !accessToken || !workspaceId) return;
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const response = await getWorkspaceInvitations(accessToken, workspaceId);
      if (id === requestId.current) setInvitations(response.data);
    } catch (requestError) {
      if (id === requestId.current) {
        setInvitations([]);
        setError(requestError instanceof Error ? requestError.message : "Failed to load workspace invitations.");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [accessToken, enabled, isReady, workspaceId]);

  React.useEffect(() => {
    if (!enabled) return;
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [enabled, reload]);

  return { invitations, setInvitations, loading, error, reload };
}
