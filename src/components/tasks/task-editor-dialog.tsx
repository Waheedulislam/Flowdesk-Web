"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskPriority, TaskStatus } from "@/lib/dashboard-data";
import type { TaskItem } from "@/lib/tasks-data";

interface TaskEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskItem | null;
  onSave: (payload: {
    title: string;
    description: string;
    project: string;
    assignee: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
  }) => void;
}

const defaultValues = {
  title: "",
  description: "",
  project: "Apollo Web Redesign",
  assignee: "Nina Patel",
  status: "TODO" as TaskStatus,
  priority: "MEDIUM" as TaskPriority,
  dueDate: "Aug 24, 2026",
};

export function TaskEditorDialog({
  open,
  onOpenChange,
  task,
  onSave,
}: TaskEditorDialogProps) {
  if (!open) return null;

  return (
    <TaskEditorDialogContent
      key={task?.id ?? "new"}
      task={task}
      onOpenChange={onOpenChange}
      onSave={onSave}
    />
  );
}

function TaskEditorDialogContent({
  task,
  onOpenChange,
  onSave,
}: Omit<TaskEditorDialogProps, "open">) {
  const [form, setForm] = React.useState(() =>
    task
      ? {
          title: task.title,
          description: task.description,
          project: task.project,
          assignee: task.assignee,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate,
        }
      : defaultValues,
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
                value={form.project}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    project: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Apollo Web Redesign">Apollo Web Redesign</option>
                <option value="Atlas Mobile App">Atlas Mobile App</option>
                <option value="Orbit Analytics">Orbit Analytics</option>
                <option value="Nova Design System">Nova Design System</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Assignee</label>
              <select
                value={form.assignee}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    assignee: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Nina Patel">Nina Patel</option>
                <option value="Jun Kim">Jun Kim</option>
                <option value="Dylan Cruz">Dylan Cruz</option>
                <option value="Tara Brooks">Tara Brooks</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                value={form.status}
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
                value={form.dueDate}
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(form);
                onOpenChange(false);
              }}
            >
              Save task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
