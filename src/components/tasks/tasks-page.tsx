"use client";

import * as React from "react";
import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskFilters } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { TaskDetails } from "@/components/tasks/task-details";
import { TaskEditorDialog } from "@/components/tasks/task-editor-dialog";
import { mockTasks, type TaskItem } from "@/lib/tasks-data";
import type { TaskStatus } from "@/lib/dashboard-data";

export function TasksPage() {
  const [tasks, setTasks] = React.useState(mockTasks);
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
        const matchesStatus = status === "All" || task.status === status;
        const matchesPriority =
          priority === "All" || task.priority === priority;
        const matchesAssignee =
          assignee === "All" || task.assignee === assignee;
        const matchesProject = project === "All" || task.project === project;
        return (
          matchesQuery &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee &&
          matchesProject
        );
      })
      .sort((left, right) => {
        switch (sort) {
          case "updated":
            return left.updatedAt.localeCompare(right.updatedAt);
          case "priority":
            return left.priority.localeCompare(right.priority);
          case "title":
            return left.title.localeCompare(right.title);
          default:
            return left.dueDate.localeCompare(right.dueDate);
        }
      });
  }, [assignee, priority, project, search, sort, status, tasks]);

  const handleCreateTask = (payload: {
    title: string;
    description: string;
    project: string;
    assignee: string;
    status: TaskStatus;
    priority: string;
    dueDate: string;
  }) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      project: payload.project,
      assignee: payload.assignee,
      assigneeInitials: payload.assignee
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      status: payload.status,
      priority: payload.priority as TaskItem["priority"],
      dueDate: payload.dueDate,
      dueTone:
        payload.status === "DONE"
          ? "done"
          : payload.priority === "URGENT"
            ? "overdue"
            : "upcoming",
      createdAt: "Just now",
      updatedAt: "Just now",
      comments: 0,
      attachments: 0,
      commentsList: [],
      attachmentsList: [],
    };
    setTasks((current) => [newTask, ...current]);
    setSelectedTask(newTask);
    setDetailsOpen(true);
  };

  const handleEditTask = (payload: {
    title: string;
    description: string;
    project: string;
    assignee: string;
    status: TaskStatus;
    priority: string;
    dueDate: string;
  }) => {
    if (!editingTask) return;
    setTasks((current) =>
      current.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: payload.title,
              description: payload.description,
              project: payload.project,
              assignee: payload.assignee,
              status: payload.status,
              priority: payload.priority as TaskItem["priority"],
              dueDate: payload.dueDate,
              updatedAt: "Just now",
            }
          : task,
      ),
    );
    setEditingTask(null);
  };

  const handleMoveTask = (taskId: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status, updatedAt: "Just now" } : task,
      ),
    );
    const moved = tasks.find((task) => task.id === taskId);
    if (moved) {
      setSelectedTask({ ...moved, status, updatedAt: "Just now" });
    }
  };

  const openTaskDetails = (task: TaskItem) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  const requestDeleteTask = (task: TaskItem) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!taskToDelete) return;
    setTasks((current) =>
      current.filter((task) => task.id !== taskToDelete.id),
    );
    setDeleteConfirmOpen(false);
    setDetailsOpen(false);
    setSelectedTask(null);
    setTaskToDelete(null);
  };

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
                <TaskList tasks={filteredTasks} onOpen={openTaskDetails} />
              ) : (
                <KanbanBoard
                  tasks={filteredTasks}
                  onOpen={openTaskDetails}
                  onMoveTask={handleMoveTask}
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
                      <p className="font-medium text-foreground">
                        {task.title}
                      </p>
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
          onDeleteRequest={requestDeleteTask}
        />

        <TaskEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          task={editingTask}
          onSave={(payload) => {
            if (editingTask) {
              handleEditTask(payload);
            } else {
              handleCreateTask(payload);
            }
          }}
        />

        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
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
              This action is mock-only and will remove the task from the current
              view.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete task
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
