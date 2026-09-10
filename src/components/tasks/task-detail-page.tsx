"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { TaskDetails } from "@/components/tasks/task-details";
import { TaskEditorDialog } from "@/components/tasks/task-editor-dialog";
import { useTaskCollaboration } from "@/components/tasks/hooks/use-task-collaboration";
import { useTaskDetail } from "@/components/tasks/hooks/use-task-detail";
import { useWorkspaceMembers } from "@/components/workspace/hooks/use-workspace-members";
import { useProjects } from "@/components/projects/hooks/use-projects";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import {
  deleteTask,
  updateTask,
  type TaskPriority,
  type TaskStatus,
  type TaskRecord,
} from "@/lib/api/task.api";
import type { TaskItem } from "@/lib/tasks-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function formatDate(value: string | null) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "No due date"
    : date.toLocaleDateString();
}

function toTaskItem(task: TaskRecord): TaskItem {
  const assignee = task.assignee;
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description ?? "",
    project: task.project?.name ?? "Unknown project",
    assignee: assignee?.name ?? "Unassigned",
    assigneeId: task.assignedTo,
    assigneeAvatar: assignee?.avatar ?? null,
    assigneeInitials: (assignee?.name ?? "U")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    status: task.status,
    priority: task.priority,
    dueDate: formatDate(task.dueDate),
    dueTone:
      task.status === "DONE"
        ? "done"
        : task.dueDate && new Date(task.dueDate) < new Date()
          ? "overdue"
          : "upcoming",
    comments: 0,
    attachments: 0,
    createdAt: formatDate(task.createdAt),
    updatedAt: formatDate(task.updatedAt),
    createdAtValue: task.createdAt,
    updatedAtValue: task.updatedAt,
    dueDateValue: task.dueDate,
    creatorName: task.creator?.name,
    creatorEmail: task.creator?.email,
    creatorAvatar: task.creator?.avatar,
    commentsList: [],
    attachmentsList: [],
  };
}

type Assignee = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export function TaskDetailPage({ taskId }: { taskId: string }) {
  const router = useRouter();
  const { accessToken, isReady, user } = useAuth();
  const { activeWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const detail = useTaskDetail({ accessToken, isReady, taskId });
  const workspaceMembers = useWorkspaceMembers({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });
  const projectsState = useProjects({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const canManage =
    activeWorkspace?.role === "OWNER" || activeWorkspace?.role === "ADMIN";
  const collaboration = useTaskCollaboration({
    accessToken,
    isReady,
    taskId,
    enabled: Boolean(detail.task),
  });

  const task = detail.task ? toTaskItem(detail.task) : null;
  const assignees = React.useMemo<Assignee[]>(() => {
    const options = new Map<string, Assignee>();
    workspaceMembers.members.forEach((member) => {
      options.set(member.userId, {
        id: member.userId,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
      });
    });
    if (detail.task?.assignee) {
      options.set(detail.task.assignee.id, detail.task.assignee);
    }
    return [...options.values()];
  }, [detail.task, workspaceMembers.members]);

  const saveTask = async (payload: {
    title: string;
    description: string;
    projectId: string;
    assignedTo: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => {
    if (!accessToken || !detail.task) throw new Error("Task is unavailable.");
    const response = await updateTask(accessToken, detail.task.id, {
      projectId: payload.projectId,
      title: payload.title.trim(),
      description: payload.description.trim() || undefined,
      assignedTo: payload.assignedTo || undefined,
      status: payload.status,
      priority: payload.priority,
      dueDate: payload.dueDate
        ? new Date(`${payload.dueDate}T00:00:00.000Z`).toISOString()
        : undefined,
    });
    detail.setTask({
      ...detail.task,
      ...response.data,
      project:
        projectsState.data.find(
          (project) => project.id === payload.projectId,
        ) ?? detail.task.project,
      creator: detail.task.creator,
      assignee:
        response.data.assignedTo === detail.task.assignedTo
          ? detail.task.assignee
          : (assignees.find((item) => item.id === response.data.assignedTo) ??
            null),
    });
    setEditorOpen(false);
    toast.success("Task updated successfully");
  };

  const removeTask = async () => {
    if (!accessToken || !detail.task) return;
    await deleteTask(accessToken, detail.task.id);
    toast.success("Task deleted successfully");
    router.push("/tasks");
  };

  if (!isReady || workspaceLoading || detail.loading)
    return <Message title="Loading task..." />;
  if (!activeWorkspace)
    return (
      <Message
        title="No workspace selected"
        message="Select a workspace to view this task."
      />
    );
  if (
    detail.error ||
    !detail.task ||
    detail.task.project?.workspaceId !== activeWorkspace.id
  ) {
    return (
      <Message
        title="Unable to load task"
        message={
          detail.error ?? "This task is unavailable in the selected workspace."
        }
        action="Try again"
        onAction={() => void detail.reload()}
      />
    );
  }
  if (!task) return null;

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => router.push("/tasks")}>
        Back to tasks
      </Button>
      <TaskDetails
        task={task}
        open
        onOpenChange={(open) => {
          if (!open) router.push("/tasks");
        }}
        onEdit={() => setEditorOpen(true)}
        onDeleteRequest={() => setDeleteOpen(true)}
        canManage={canManage}
        currentUserId={user?.id ?? null}
        comments={collaboration.comments}
        files={collaboration.files}
        collaborationLoading={collaboration.loading}
        collaborationError={collaboration.error}
        collaborationMutating={collaboration.mutating}
        onRetryCollaboration={() => void collaboration.reload()}
        onAddComment={collaboration.addComment}
        onDeleteComment={collaboration.removeComment}
        onUploadFile={collaboration.uploadFile}
        onDeleteFile={collaboration.removeFile}
      />
      <TaskEditorDialog
        open={editorOpen && canManage}
        onOpenChange={setEditorOpen}
        task={task}
        projects={projectsState.data.map((project) => ({
          id: project.id,
          name: project.name,
        }))}
        assignees={assignees}
        onSave={saveTask}
      />
      <DeleteTaskDialog
        open={deleteOpen && canManage}
        onOpenChange={setDeleteOpen}
        onDelete={removeTask}
      />
    </div>
  );
}

function Message({
  title,
  message,
  action,
  onAction,
}: {
  title: string;
  message?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <p className="font-semibold">{title}</p>
          {message ? (
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          ) : null}
          {action && onAction ? (
            <Button className="mt-4" onClick={onAction}>
              {action}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
