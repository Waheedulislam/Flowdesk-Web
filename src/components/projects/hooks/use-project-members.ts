"use client";

import * as React from "react";

import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
  updateProjectMemberRole,
  type AddProjectMemberPayload,
  type ProjectMemberRecord,
  type ProjectRole,
} from "@/lib/api/project.api";

type Options = {
  accessToken: string | null;
  isReady: boolean;
  projectId: string | undefined;
};

export function useProjectMembers({
  accessToken,
  isReady,
  projectId,
}: Options) {
  const [members, setMembers] = React.useState<ProjectMemberRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    if (!isReady || !accessToken || !projectId) {
      setMembers([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setMembers([]);
    setError(null);
    try {
      const response = await getProjectMembers(accessToken, projectId);
      if (id === requestId.current) setMembers(response.data);
    } catch (requestError) {
      if (id === requestId.current) {
        setMembers([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load project members.",
        );
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [accessToken, isReady, projectId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  const addMember = React.useCallback(
    async (payload: AddProjectMemberPayload) => {
      if (!accessToken || !projectId) {
        throw new Error("Your session is no longer valid. Please try again.");
      }
      const response = await addProjectMember(accessToken, projectId, payload);
      await reload();
      return response.data;
    },
    [accessToken, projectId, reload],
  );

  const updateRole = React.useCallback(
    async (memberId: string, role: ProjectRole) => {
      if (!accessToken) {
        throw new Error("Your session is no longer valid. Please try again.");
      }
      const response = await updateProjectMemberRole(
        accessToken,
        memberId,
        role,
      );
      await reload();
      return response.data;
    },
    [accessToken, reload],
  );

  const removeMember = React.useCallback(
    async (memberId: string) => {
      if (!accessToken) {
        throw new Error("Your session is no longer valid. Please try again.");
      }
      await removeProjectMember(accessToken, memberId);
      await reload();
    },
    [accessToken, reload],
  );

  return {
    members,
    loading,
    error,
    reload,
    addMember,
    updateRole,
    removeMember,
  };
}
