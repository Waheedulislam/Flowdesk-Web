"use client";

import * as React from "react";
import { Paperclip, PencilLine, Trash2, X } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
} from "@/components/tasks/task-status-badge";
import type { TaskItem } from "@/lib/tasks-data";
import type { TaskCommentRecord, TaskFileRecord } from "@/lib/api/task.api";

interface TaskDetailsProps {
  task: TaskItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: TaskItem) => void;
  onDeleteRequest: (task: TaskItem) => void;
  canManage?: boolean;
  currentUserId: string | null;
  comments: TaskCommentRecord[];
  files: TaskFileRecord[];
  collaborationLoading: boolean;
  collaborationError: string | null;
  collaborationMutating: boolean;
  onRetryCollaboration: () => void;
  onAddComment: (comment: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
}

export function TaskDetails({
  task,
  open,
  onOpenChange,
  onEdit,
  onDeleteRequest,
  canManage = true,
  currentUserId,
  comments,
  files,
  collaborationLoading,
  collaborationError,
  collaborationMutating,
  onRetryCollaboration,
  onAddComment,
  onDeleteComment,
  onUploadFile,
  onDeleteFile,
}: TaskDetailsProps) {
  const [comment, setComment] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!open || !task) return null;

  const submitComment = async () => {
    const value = comment.trim();
    if (!value) return;
    setFormError(null);
    try {
      await onAddComment(value);
      setComment("");
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Unable to add comment.",
      );
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setFormError(null);
    try {
      await onUploadFile(file);
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Unable to upload file.",
      );
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setFormError(null);
    try {
      await onDeleteComment(commentId);
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Unable to delete comment.",
      );
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setFormError(null);
    try {
      await onDeleteFile(fileId);
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : "Unable to delete file.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-3">
      <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-background shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Task details
            </p>
            <h3 className="mt-1 text-xl font-semibold">{task.title}</h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>

          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Project
                  </p>
                  <p className="mt-1 font-medium">{task.project}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Creator
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar
                      name={task.creatorName ?? "Unknown creator"}
                      src={task.creatorAvatar ?? undefined}
                      className="size-6"
                    />
                    <p className="font-medium">
                      {task.creatorName ?? "Unknown creator"}
                    </p>
                  </div>
                  {task.creatorEmail ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {task.creatorEmail}
                    </p>
                  ) : null}
                </div>
                <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Assignee
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar
                      name={task.assignee}
                      src={task.assigneeAvatar ?? undefined}
                      className="size-6"
                    />
                    <p className="font-medium">{task.assignee}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                <span>Due date</span>
                <span className="font-medium text-foreground">
                  {task.dueDate}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                <span>Created</span>
                <span className="font-medium text-foreground">
                  {task.createdAt}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3">
                <span>Updated</span>
                <span className="font-medium text-foreground">
                  {task.updatedAt}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collaborationLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading comments...
                </p>
              ) : comments.length > 0 ? (
                comments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border/70 bg-background/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={item.user.name}
                        src={item.user.avatar ?? undefined}
                        className="size-8"
                      />
                      <div>
                        <p className="font-medium">{item.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {item.comment}
                    </p>
                    {item.userId === currentUserId ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        disabled={collaborationMutating}
                        onClick={() => void handleDeleteComment(item.id)}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              )}
              <div className="space-y-2">
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Write a comment"
                  disabled={collaborationMutating}
                />
                <Button
                  className="w-full sm:w-auto"
                  disabled={!comment.trim() || collaborationMutating}
                  onClick={() => void submitComment()}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Attachments</CardTitle>
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    onChange={(event) => void handleFileChange(event)}
                    disabled={collaborationMutating}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={collaborationMutating}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="size-4" />
                    Upload
                  </Button>
                </>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {collaborationLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading attachments...
                </p>
              ) : files.length > 0 ? (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-accent p-2">
                        <Paperclip className="size-4" />
                      </div>
                      <div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium hover:underline"
                        >
                          {file.fileName}
                        </a>
                        <p className="text-sm text-muted-foreground">
                          Uploaded by {file.uploader.name} ·{" "}
                          {new Date(file.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={collaborationMutating}
                      onClick={() => void handleDeleteFile(file.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No attachments yet.
                </p>
              )}
              {collaborationError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <p>{collaborationError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={onRetryCollaboration}
                  >
                    Retry
                  </Button>
                </div>
              ) : null}
              {formError ? (
                <p className="text-sm text-destructive">{formError}</p>
              ) : null}
            </CardContent>
          </Card>

          {canManage ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => onEdit(task)}>
                <PencilLine className="size-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDeleteRequest(task)}
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
