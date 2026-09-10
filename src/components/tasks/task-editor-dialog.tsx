"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskPriority, TaskStatus } from "@/lib/dashboard-data";
import type { TaskItem } from "@/lib/tasks-data";

type Option = { id: string; name: string; email?: string };

interface TaskEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskItem | null;
  projects: Option[];
  assignees: Option[];
  onSave: (payload: {
    title: string;
    description: string;
    projectId: string;
    assignedTo: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => Promise<void>;
}

export function TaskEditorDialog({
  open,
  onOpenChange,
  task,
  projects,
  assignees,
  onSave,
}: TaskEditorDialogProps) {
  if (!open) return null;

  return (
    <TaskEditorDialogContent
      key={task?.id ?? "new"}
      task={task}
      projects={projects}
      assignees={assignees}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  );
}

function TaskEditorDialogContent({
  task,
  projects,
  assignees,
  onOpenChange,
  onSave,
}: Omit<TaskEditorDialogProps, "open">) {
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          projectId: task.projectId,
          assignedTo: task.assigneeId ?? "",
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDateValue?.slice(0, 10) ?? "",
        }
      : {
          title: "",
          description: "",
          projectId: projects[0]?.id ?? "",
          assignedTo: assignees[0]?.id ?? "",
          status: "TODO" as TaskStatus,
          priority: "MEDIUM" as TaskPriority,
          dueDate: "",
        },
  );

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {task ? "Edit task" : "New task"}
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              {task ? "Update the task details" : "Create a new task"}
            </h3>
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Title</label>
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Task title"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Explain the work in a few lines"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Project</label>
              <select
                value={form.projectId}
                disabled={saving}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    projectId: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {projects.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Assignee</label>
              <select
                value={form.assignedTo}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    assignedTo: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Unassigned</option>
                {assignees.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                value={form.status}
                disabled={!task || saving}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as TaskStatus,
                  }))
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="IN_REVIEW">In review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Priority</label>
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority: event.target.value as TaskPriority,
                  }))
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Due date</label>
              <Input
                type="date"
                value={form.dueDate ? form.dueDate.slice(0, 10) : ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    dueDate: event.target.value,
                  }))
                }
                placeholder="Due date"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              disabled={saving}
              onClick={() => {
                setSaving(true);
                void onSave(form)
                  .then(() => onOpenChange(false))
                  .catch(() => undefined)
                  .finally(() => setSaving(false));
              }}
            >
              {saving ? "Saving..." : "Save task"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
