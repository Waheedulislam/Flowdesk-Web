"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskPriority, TaskStatus } from "@/lib/dashboard-data";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  assignee: string;
  onAssigneeChange: (value: string) => void;
  project: string;
  onProjectChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  view: "list" | "kanban";
  onViewChange: (view: "list" | "kanban") => void;
}

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  assignee,
  onAssigneeChange,
  project,
  onProjectChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:flex-wrap">
        <div className="relative md:min-w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks"
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All statuses</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="IN_REVIEW">In review</option>
          <option value="DONE">Done</option>
        </select>
        <select
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
        <select
          value={assignee}
          onChange={(event) => onAssigneeChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All assignees</option>
          <option value="Nina Patel">Nina Patel</option>
          <option value="Jun Kim">Jun Kim</option>
          <option value="Dylan Cruz">Dylan Cruz</option>
          <option value="Tara Brooks">Tara Brooks</option>
        </select>
        <select
          value={project}
          onChange={(event) => onProjectChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="All">All projects</option>
          <option value="Apollo Web Redesign">Apollo Web Redesign</option>
          <option value="Atlas Mobile App">Atlas Mobile App</option>
          <option value="Orbit Analytics">Orbit Analytics</option>
          <option value="Nova Design System">Nova Design System</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="due">Due date</option>
          <option value="updated">Updated</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        <div className="flex rounded-md border border-input bg-background p-1">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("list")}
          >
            List
          </Button>
          <Button
            variant={view === "kanban" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("kanban")}
          >
            Kanban
          </Button>
        </div>
      </div>
    </div>
  );
}
