"use client";

import * as React from "react";
import {
  AlertTriangle,
  Paperclip,
  MessageSquare,
  PencilLine,
  Trash2,
  X,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
} from "@/components/tasks/task-status-badge";
import type { TaskItem } from "@/lib/tasks-data";

interface TaskDetailsProps {
  task: TaskItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (task: TaskItem) => void;
  onDeleteRequest: (task: TaskItem) => void;
}

export function TaskDetails({
  task,
  open,
  onOpenChange,
  onEdit,
  onDeleteRequest,
}: TaskDetailsProps) {
  if (!open || !task) return null;

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
                    Assignee
                  </p>
                  <p className="mt-1 font-medium">{task.assignee}</p>
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
              {task.commentsList.length > 0 ? (
                task.commentsList.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-border/70 bg-background/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={comment.author} className="size-8" />
                      <div>
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {comment.time}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {comment.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              )}
              <div className="space-y-2">
                <textarea
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Write a comment"
                />
                <Button className="w-full sm:w-auto">Send</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {task.attachmentsList.length > 0 ? (
                task.attachmentsList.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-accent p-2">
                        <Paperclip className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {attachment.type} · {attachment.size}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {attachment.uploadedBy}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No attachments yet.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => onEdit(task)}>
              <PencilLine className="size-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => onDeleteRequest(task)}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
