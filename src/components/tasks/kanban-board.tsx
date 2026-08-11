"use client";

import * as React from "react";
import {
  CheckCircle2,
  CircleDashed,
  Eye,
  GripVertical,
  LoaderCircle,
  MessageSquare,
  Paperclip,
} from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
} from "@/components/tasks/task-status-badge";
import type { TaskItem } from "@/lib/tasks-data";
import type { TaskStatus } from "@/lib/dashboard-data";

interface KanbanBoardProps {
  tasks: TaskItem[];
  onOpen: (task: TaskItem) => void;
  onMoveTask: (taskId: string, status: TaskStatus) => void;
}

const columns: Array<{ key: TaskStatus; title: string; description: string }> =
  [
    { key: "TODO", title: "Todo", description: "Ready to start" },
    { key: "IN_PROGRESS", title: "In progress", description: "Active now" },
    { key: "IN_REVIEW", title: "In review", description: "Pending review" },
    { key: "DONE", title: "Done", description: "Completed" },
  ];

const columnMeta: Record<
  TaskStatus,
  {
    icon: React.ElementType;
    headerClassName: string;
    iconClassName: string;
  }
> = {
  TODO: {
    icon: CircleDashed,
    headerClassName: "border-border/70 bg-muted/50 text-muted-foreground",
    iconClassName: "text-muted-foreground",
  },
  IN_PROGRESS: {
    icon: LoaderCircle,
    headerClassName: "border-info/20 bg-info/10 text-info",
    iconClassName: "text-info",
  },
  IN_REVIEW: {
    icon: Eye,
    headerClassName: "border-warning/20 bg-warning/12 text-warning-foreground",
    iconClassName: "text-warning-foreground",
  },
  DONE: {
    icon: CheckCircle2,
    headerClassName: "border-success/20 bg-success/12 text-success",
    iconClassName: "text-success",
  },
};

export function KanbanBoard({ tasks, onOpen, onMoveTask }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState<TaskStatus | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const grouped = columns.reduce<Record<TaskStatus, TaskItem[]>>(
    (acc, column) => {
      acc[column.key] = tasks.filter((task) => task.status === column.key);
      return acc;
    },
    { TODO: [], IN_PROGRESS: [], IN_REVIEW: [], DONE: [] },
  );

  const handleDrop = (status: TaskStatus) => {
    if (!draggedId) return;
    onMoveTask(draggedId, status);
    setDraggedId(null);
    setDragOver(null);
  };

  return (
    <div className="w-full overflow-x-hidden pb-2">
      <div className="min-w-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1 py-2 lg:gap-5 items-stretch">
        {columns.map((column) => {
          const columnTasks = grouped[column.key];
          const meta = columnMeta[column.key];
          const Icon = meta.icon;

          return (
            <div
              key={column.key}
              className="min-h-105 min-w-0 flex flex-col rounded-2xl border border-border/70 bg-linear-to-b from-background/95 to-muted/20 p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.4)] overflow-hidden"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/90 ${meta.iconClassName}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {column.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {column.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.headerClassName}`}
                >
                  {columnTasks.length}
                </span>
              </div>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(column.key);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(column.key)}
                className={`flex flex-1 flex-col gap-3 rounded-xl border border-dashed p-3 transition-all ${
                  dragOver === column.key
                    ? "border-primary/40 bg-primary/8 shadow-inner"
                    : "border-transparent bg-background/25"
                }`}
              >
                {columnTasks.map((task) => {
                  const isDragging = draggedId === task.id;
                  const isHovered = hoveredId === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDraggedId(task.id)}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setDragOver(null);
                      }}
                      onMouseEnter={() => setHoveredId(task.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => onOpen(task)}
                      className={`group min-w-0 flex min-h-[180px] w-full flex-col justify-between rounded-2xl border bg-background/95 p-4 shadow-sm transition-all duration-200 ${
                        isDragging
                          ? "scale-[1.03] border-primary/35 bg-background shadow-[0_16px_40px_-18px_rgba(99,102,241,0.45)]"
                          : "cursor-grab border-border/70 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_14px_32px_-20px_rgba(15,23,42,0.35)]"
                      } ${isHovered && !isDragging ? "border-primary/20 shadow-md" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-sm font-semibold leading-5 text-foreground"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {task.title}
                          </p>
                          <p
                            className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/80"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {task.project}
                          </p>
                        </div>
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/70 text-muted-foreground transition-colors ${
                            isDragging
                              ? "text-primary"
                              : "group-hover:text-foreground"
                          }`}
                        >
                          <GripVertical className="size-4" />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <TaskPriorityBadge priority={task.priority} />
                        <TaskStatusBadge status={task.status} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <MessageSquare className="size-3.5" />
                            {task.comments}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Paperclip className="size-3.5" />
                            {task.attachments}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">
                          {task.assignee}
                        </span>
                        <Avatar
                          name={task.assignee}
                          className="size-8 border border-border/60 bg-background/90"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
