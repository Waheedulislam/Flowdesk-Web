"use client";

import * as React from "react";
import { createProject, deleteProject, updateProject, type CreateProjectPayload, type ProjectRecord, type UpdateProjectPayload } from "@/lib/api/project.api";

type Options = { accessToken: string | null; workspaceId?: string; onCreated: (project: ProjectRecord) => void; onUpdated: (project: ProjectRecord) => void; onDeleted: (projectId: string) => void };

export function useProjectActions({ accessToken, workspaceId, onCreated, onUpdated, onDeleted }: Options) {
  const requireToken = React.useCallback(() => {
    if (!accessToken) throw new Error("Your session is no longer valid. Please sign in again.");
    return accessToken;
  }, [accessToken]);
  const create = React.useCallback(async (payload: CreateProjectPayload) => {
    if (!workspaceId) throw new Error("Select a workspace before creating a project.");
    const response = await createProject(requireToken(), workspaceId, payload); onCreated(response.data); return response.data;
  }, [onCreated, requireToken, workspaceId]);
  const update = React.useCallback(async (projectId: string, payload: UpdateProjectPayload) => {
    const response = await updateProject(requireToken(), projectId, payload); onUpdated(response.data); return response.data;
  }, [onUpdated, requireToken]);
  const remove = React.useCallback(async (projectId: string) => { await deleteProject(requireToken(), projectId); onDeleted(projectId); }, [onDeleted, requireToken]);
  return { create, update, remove };
}
