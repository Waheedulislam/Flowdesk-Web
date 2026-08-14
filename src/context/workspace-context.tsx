"use client";

import * as React from "react";

import { useAuth } from "@/context/auth-context";
import {
  createWorkspace as createWorkspaceRequest,
  getWorkspaces,
  type CreateWorkspacePayload,
  type Workspace,
} from "@/lib/api/workspace.api";

type WorkspaceContextValue = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  selectWorkspace: (workspaceId: string) => void;
  refreshWorkspaces: () => Promise<Workspace[]>;
  createWorkspace: (payload: CreateWorkspacePayload) => Promise<Workspace>;
};

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(null);

/**
 * Shares the authenticated user's real workspace list between the app shell
 * switcher and `/workspace`. The backend has no current-workspace endpoint,
 * so selection is intentionally client-side for this phase.
 */
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, isAuthenticated, isReady } = useAuth();
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refreshWorkspaces = React.useCallback(async () => {
    if (!accessToken) {
      setWorkspaces([]);
      setActiveWorkspaceId(null);
      return [];
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getWorkspaces(accessToken);
      const nextWorkspaces = response.data;
      setWorkspaces(nextWorkspaces);
      setActiveWorkspaceId((current) =>
        nextWorkspaces.some((workspace) => workspace.id === current)
          ? current
          : (nextWorkspaces[0]?.id ?? null),
      );
      return nextWorkspaces;
    } catch (requestError) {
      const message = requestError instanceof Error
        ? requestError.message
        : "We couldn't load your workspaces. Please try again.";
      setWorkspaces([]);
      setActiveWorkspaceId(null);
      setError(message);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  React.useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      const timeoutId = window.setTimeout(() => {
        setWorkspaces([]);
        setActiveWorkspaceId(null);
        setError(null);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }
    const timeoutId = window.setTimeout(() => void refreshWorkspaces().catch(() => undefined), 0);
    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, isReady, refreshWorkspaces]);

  const createWorkspace = React.useCallback(async (payload: CreateWorkspacePayload) => {
    if (!accessToken) throw new Error("Your session is no longer valid. Please sign in again.");
    const response = await createWorkspaceRequest(accessToken, payload);
    const nextWorkspaces = await refreshWorkspaces();
    const createdWorkspace = nextWorkspaces.find((workspace) => workspace.id === response.data.id);
    if (!createdWorkspace) throw new Error("Workspace was created, but we couldn't refresh your workspace list. Please try again.");
    setActiveWorkspaceId(createdWorkspace.id);
    return createdWorkspace;
  }, [accessToken, refreshWorkspaces]);

  const value = React.useMemo(() => ({
    workspaces,
    activeWorkspace: workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? null,
    isLoading,
    error,
    selectWorkspace: setActiveWorkspaceId,
    refreshWorkspaces,
    createWorkspace,
  }), [activeWorkspaceId, createWorkspace, error, isLoading, refreshWorkspaces, workspaces]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return context;
}
