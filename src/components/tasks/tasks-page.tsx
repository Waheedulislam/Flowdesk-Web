"use client";

import * as React from "react";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useTasks, type TaskProject } from "@/components/tasks/hooks/use-tasks";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDetails } from "@/components/tasks/task-details";
import { TaskEditorDialog } from "@/components/tasks/task-editor-dialog";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { useWorkspaceMembers } from "@/components/workspace/hooks/use-workspace-members";
import { useProjects } from "@/components/projects/hooks/use-projects";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaskPriority, TaskStatus } from "@/lib/api/task.api";
import type { TaskRecord } from "@/lib/api/task.api";
import type { TaskItem } from "@/lib/tasks-data";

type AssigneeOption = {
  id: string;
  name: string;
  email?: string;
  avatar: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "No due date"
    : date.toLocaleDateString();
}

function toDateInput(value: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function toTaskItem(
  task: TaskRecord,
  projects: TaskProject[],
  assignees: AssigneeOption[],
): TaskItem {
  const project = projects.find((item) => item.id === task.projectId);
  const assignee =
    task.assignee ?? assignees.find((item) => item.id === task.assignedTo);
  const dueDate = formatDate(task.dueDate);
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    description: task.description ?? "",
    project: project?.name ?? "Unknown project",
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
    dueDate,
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
    commentsList: [],
    attachmentsList: [],
  };
}

export function TasksPage() {
  const { accessToken, isReady } = useAuth();
  const { activeWorkspace, isLoading: workspaceLoading } = useWorkspace();
  const projectsState = useProjects({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });
  const projectOptions = React.useMemo(
    () =>
      projectsState.data.map((project) => ({
        id: project.id,
        name: project.name,
      })),
    [projectsState.data],
  );
  const tasksState = useTasks({
    accessToken,
    isReady,
    projects: projectOptions,
  });
  const workspaceMembers = useWorkspaceMembers({
    accessToken,
    isReady,
    workspaceId: activeWorkspace?.id,
  });
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [priority, setPriority] = React.useState("All");
  const [assignee, setAssignee] = React.useState("All");
  const [project, setProject] = React.useState("All");
  const [sort, setSort] = React.useState("due");
  const [view, setView] = React.useState<"list" | "kanban">("list");
  const [selectedTask, setSelectedTask] = React.useState<TaskItem | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<TaskItem | null>(null);
  const [mutationLoading, setMutationLoading] = React.useState(false);

  const assigneeOptions = React.useMemo(() => {
    const options = new Map<string, AssigneeOption>();
    workspaceMembers.members.forEach((member) =>
      options.set(member.userId, {
        id: member.userId,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
      }),
    );
    tasksState.tasks.forEach((task) => {
      if (task.assignee) options.set(task.assignee.id, task.assignee);
    });
    return [...options.values()];
  }, [tasksState.tasks, workspaceMembers.members]);

  const tasks = React.useMemo(
    () =>
      tasksState.tasks.map((task) =>
        toTaskItem(task, projectOptions, assigneeOptions),
      ),
    [assigneeOptions, projectOptions, tasksState.tasks],
  );
  const effectiveProject =
    project === "All" || projectOptions.some((option) => option.id === project)
      ? project
      : "All";
  const effectiveAssignee =
    assignee === "All" ||
    assigneeOptions.some((option) => option.id === assignee)
      ? assignee
      : "All";

  const filteredTasks = React.useMemo(() => {
    const query = search.toLowerCase();
    return [...tasks]
      .filter((task) => {
        const matchesQuery = [
          task.title,
          task.description,
          task.project,
          task.assignee,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
        return (
          matchesQuery &&
          (status === "All" || task.status === status) &&
          (priority === "All" || task.priority === priority) &&
          (effectiveAssignee === "All" ||
            task.assigneeId === effectiveAssignee) &&
          (effectiveProject === "All" || task.projectId === effectiveProject)
        );
      })
      .sort((left, right) =>
        sort === "title"
          ? left.title.localeCompare(right.title)
          : sort === "priority"
            ? left.priority.localeCompare(right.priority)
            : sort === "updated"
              ? right.updatedAtValue.localeCompare(left.updatedAtValue)
              : (left.dueDateValue ?? "9999").localeCompare(
                  right.dueDateValue ?? "9999",
                ),
      );
  }, [
    effectiveAssignee,
    effectiveProject,
    priority,
    search,
    sort,
    status,
    tasks,
  ]);

  const saveTask = async (payload: {
    title: string;
    description: string;
    projectId: string;
    assignedTo: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => {
    setMutationLoading(true);
    try {
      const updatePayload = {
        title: payload.title,
        description: payload.description || undefined,
        assignedTo: payload.assignedTo || undefined,
        priority: payload.priority,
        status: payload.status,
        dueDate: toDateInput(payload.dueDate),
      };
      if (editingTask) {
        await tasksState.update(editingTask.id, updatePayload);
        toast.success("Task updated successfully");
      } else {
        await tasksState.create(payload.projectId, {
          title: payload.title,
          description: payload.description || undefined,
          assignedTo: payload.assignedTo || undefined,
          priority: payload.priority,
          dueDate: toDateInput(payload.dueDate),
        });
        toast.success("Task created successfully");
      }
      setEditingTask(null);
      setEditorOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save task.",
      );
      throw error;
    } finally {
      setMutationLoading(false);
    }
  };

  const handleMoveTask = async (taskId: string, nextStatus: TaskStatus) => {
    try {
      await tasksState.update(taskId, { status: nextStatus });
      toast.success("Task status updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update task status.",
      );
    }
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setMutationLoading(true);
    try {
      await tasksState.remove(taskToDelete.id);
      setDeleteConfirmOpen(false);
      setDetailsOpen(false);
      setSelectedTask(null);
      setTaskToDelete(null);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete task.",
      );
    } finally {
      setMutationLoading(false);
    }
  };

  if (
    !isReady ||
    workspaceLoading ||
    projectsState.loading ||
    tasksState.loading
  ) {
    return <Message title="Loading tasks..." />;
  }
  if (projectsState.error || tasksState.error) {
    return (
      <Message
        title="Unable to load tasks"
        message={projectsState.error ?? tasksState.error ?? "Please try again."}
        action="Try again"
        onAction={() =>
          void Promise.all([projectsState.reload(), tasksState.reload()])
        }
      />
    );
  }
  if (!activeWorkspace)
    return (
      <Message
        title="No workspace selected"
        message="Select a workspace to view tasks."
      />
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Task management
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Keep delivery moving
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review every task from a single, polished workspace view with list
            and kanban modes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setEditingTask(null);
              setEditorOpen(true);
            }}
            disabled={!projectOptions.length}
          >
            <Sparkles className="size-4" />
            Quick add
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              setEditingTask(null);
              setEditorOpen(true);
            }}
            disabled={!projectOptions.length}
          >
            <Plus className="size-4" />
            New task
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            assignee={assignee}
            onAssigneeChange={setAssignee}
            project={project}
            onProjectChange={setProject}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
            projects={projectOptions}
            assignees={assigneeOptions}
          />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-[1.65fr_0.35fr]">
        <Card className="min-w-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Delivery overview</CardTitle>
            <div className="flex gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {filteredTasks.length} visible
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
                {tasks.filter((task) => task.status === "DONE").length} done
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {view === "list" ? (
              <TaskList
                tasks={filteredTasks}
                onOpen={(task) => {
                  setSelectedTask(task);
                  setDetailsOpen(true);
                }}
              />
            ) : (
              <KanbanBoard
                tasks={filteredTasks}
                onOpen={(task) => {
                  setSelectedTask(task);
                  setDetailsOpen(true);
                }}
                onMoveTask={(id, nextStatus) =>
                  void handleMoveTask(id, nextStatus)
                }
              />
            )}
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>What to focus on</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {filteredTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-border bg-background/70 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="mt-1">{task.project}</p>
                  </div>
                  <span className="rounded-full bg-warning/15 px-2 py-1 text-xs font-medium text-warning-foreground">
                    {task.priority}
                  </span>
                </div>
                <p className="mt-2">Due {task.dueDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <TaskDetails
        task={selectedTask}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={(task) => {
          setEditingTask(task);
          setEditorOpen(true);
        }}
        onDeleteRequest={(task) => {
          setTaskToDelete(task);
          setDeleteConfirmOpen(true);
        }}
      />
      <TaskEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        task={editingTask}
        projects={projectOptions}
        assignees={assigneeOptions}
        onSave={saveTask}
      />
      <div
        className="fixed inset-0 z-70 items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
        style={{ display: deleteConfirmOpen ? "flex" : "none" }}
      >
        <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Delete task
          </p>
          <h3 className="mt-2 text-xl font-semibold">
            Remove this task from the workspace?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This permanently deletes the task from the backend.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={mutationLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void confirmDelete()}
              disabled={mutationLoading}
            >
              {mutationLoading ? "Deleting..." : "Delete task"}
            </Button>
          </div>
        </div>
      </div>
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
