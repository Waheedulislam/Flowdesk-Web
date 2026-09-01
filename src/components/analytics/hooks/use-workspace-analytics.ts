"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import {
  getMemberAnalytics,
  getProjectAnalytics,
  getWorkspaceAnalytics,
  type MemberAnalytics,
  type ProjectAnalytics,
  type WorkspaceAnalytics,
} from "@/lib/api/analytics.api";

const emptyWorkspaceAnalytics: WorkspaceAnalytics = {
  totalProjects: 0,
  totalTasks: 0,
  completedTasks: 0,
  inProgressTasks: 0,
  todoTasks: 0,
  totalMembers: 0,
  overdueTasks: 0,
  completionRate: 0,
};

export function useWorkspaceAnalytics() {
  const { accessToken, isReady } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const workspaceId = activeWorkspace?.id;
  const [workspace, setWorkspace] = React.useState<WorkspaceAnalytics>(
    emptyWorkspaceAnalytics,
  );
  const [projects, setProjects] = React.useState<ProjectAnalytics[]>([]);
  const [members, setMembers] = React.useState<MemberAnalytics[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    if (!isReady || !accessToken || !workspaceId) {
      setWorkspace(emptyWorkspaceAnalytics);
      setProjects([]);
      setMembers([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [workspaceResponse, projectsResponse, membersResponse] =
        await Promise.all([
          getWorkspaceAnalytics(accessToken, workspaceId),
          getProjectAnalytics(accessToken, workspaceId),
          getMemberAnalytics(accessToken, workspaceId),
        ]);
      if (requestId.current !== id) return;
      setWorkspace(workspaceResponse.data);
      setProjects(projectsResponse.data);
      setMembers(membersResponse.data);
    } catch (cause) {
      if (requestId.current !== id) return;
      setWorkspace(emptyWorkspaceAnalytics);
      setProjects([]);
      setMembers([]);
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load workspace analytics.",
      );
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

  return { workspace, projects, members, loading, error, reload };
}
