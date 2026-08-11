import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { TaskPriority, TaskStatus } from "@/lib/dashboard-data";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const meta: Record<TaskStatus, BadgeProps["variant"]> = {
    TODO: "secondary",
    IN_PROGRESS: "info",
    IN_REVIEW: "warning",
    DONE: "success",
  };

  const labels: Record<TaskStatus, string> = {
    TODO: "Todo",
    IN_PROGRESS: "In progress",
    IN_REVIEW: "In review",
    DONE: "Done",
  };

  return (
    <Badge variant={meta[status]} className="whitespace-nowrap">
      {labels[status]}
    </Badge>
  );
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const meta: Record<TaskPriority, BadgeProps["variant"]> = {
    LOW: "secondary",
    MEDIUM: "info",
    HIGH: "warning",
    URGENT: "destructive",
  };

  const labels: Record<TaskPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  return (
    <Badge variant={meta[priority]} className="whitespace-nowrap">
      {labels[priority]}
    </Badge>
  );
}
