import { CalendarDays, Flag, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  priorityTone,
  taskStatusMeta,
  type Tone,
  type UpcomingTask,
} from "@/lib/dashboard-data";

/**
 * Upcoming tasks list: title, project, assignee, priority, due date, and
 * status. Overdue rows are accented so they stand out. Presentational only.
 */

const toneToBadgeVariant: Record<Tone, BadgeProps["variant"]> = {
  primary: "default",
  success: "success",
  warning: "warning",
  info: "info",
  destructive: "destructive",
  muted: "secondary",
};

interface UpcomingTasksProps {
  tasks: UpcomingTask[];
}

function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => {
          const status = taskStatusMeta[task.status];
          return (
            <div
              key={task.id}
              className={cn(
                "flex flex-col gap-3 rounded-lg border border-transparent p-3 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between",
                task.overdue && "border-destructive/20 bg-destructive/5",
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                <Avatar
                  name={task.assigneeName}
                  src={task.assigneeAvatarUrl}
                  className="size-8"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {task.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {task.project} · {task.assigneeName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
                <Badge variant={toneToBadgeVariant[priorityTone[task.priority]]}>
                  <Flag className="size-3" aria-hidden />
                  {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                </Badge>
                <Badge variant={toneToBadgeVariant[status.tone]}>{status.label}</Badge>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs",
                    task.overdue
                      ? "font-medium text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {task.overdue ? (
                    <TriangleAlert className="size-3.5" aria-hidden />
                  ) : (
                    <CalendarDays className="size-3.5" aria-hidden />
                  )}
                  {task.dueLabel}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { UpcomingTasks };
