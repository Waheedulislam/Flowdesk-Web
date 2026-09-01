"use client";

import * as React from "react";
import {
  createTaskComment,
  deleteTaskComment,
  deleteTaskFile,
  getTaskComments,
  getTaskFiles,
  uploadTaskFile,
  type TaskCommentRecord,
  type TaskFileRecord,
} from "@/lib/api/task.api";

type Options = {
  accessToken: string | null;
  isReady: boolean;
  taskId: string | null;
  enabled: boolean;
};

export function useTaskCollaboration({
  accessToken,
  isReady,
  taskId,
  enabled,
}: Options) {
  const [comments, setComments] = React.useState<TaskCommentRecord[]>([]);
  const [files, setFiles] = React.useState<TaskFileRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mutating, setMutating] = React.useState(false);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    if (!isReady || !accessToken || !taskId || !enabled) {
      setComments([]);
      setFiles([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [commentsResponse, filesResponse] = await Promise.all([
        getTaskComments(accessToken, taskId),
        getTaskFiles(accessToken, taskId),
      ]);
      if (requestId.current !== id) return;
      setComments(commentsResponse.data);
      setFiles(filesResponse.data);
    } catch (cause) {
      if (requestId.current === id) {
        setComments([]);
        setFiles([]);
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to load task collaboration data.",
        );
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, enabled, isReady, taskId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => {
      window.clearTimeout(timeoutId);
      requestId.current += 1;
    };
  }, [reload]);

  const addComment = React.useCallback(
    async (comment: string) => {
      if (!accessToken || !taskId) throw new Error("Task is unavailable.");
      setMutating(true);
      try {
        await createTaskComment(accessToken, taskId, comment);
        await reload();
      } finally {
        setMutating(false);
      }
    },
    [accessToken, reload, taskId],
  );

  const removeComment = React.useCallback(
    async (commentId: string) => {
      if (!accessToken) throw new Error("Your session is no longer valid.");
      setMutating(true);
      try {
        await deleteTaskComment(accessToken, commentId);
        await reload();
      } finally {
        setMutating(false);
      }
    },
    [accessToken, reload],
  );

  const uploadFile = React.useCallback(
    async (file: File) => {
      if (!accessToken || !taskId) throw new Error("Task is unavailable.");
      setMutating(true);
      try {
        await uploadTaskFile(accessToken, taskId, file);
        await reload();
      } finally {
        setMutating(false);
      }
    },
    [accessToken, reload, taskId],
  );

  const removeFile = React.useCallback(
    async (fileId: string) => {
      if (!accessToken) throw new Error("Your session is no longer valid.");
      setMutating(true);
      try {
        await deleteTaskFile(accessToken, fileId);
        await reload();
      } finally {
        setMutating(false);
      }
    },
    [accessToken, reload],
  );

  return {
    comments,
    files,
    loading,
    error,
    mutating,
    reload,
    addComment,
    removeComment,
    uploadFile,
    removeFile,
  };
}
