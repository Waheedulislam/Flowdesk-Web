import type { LucideIcon } from "lucide-react";
import {
  Activity,
  FileText,
  FolderKanban,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { ActivityAction, ActivityLog } from "@/lib/api/activity.api";

const actionIcons: Partial<Record<ActivityAction, LucideIcon>> = {
  CREATE: FolderKanban,
  UPDATE: Activity,
  DELETE: Activity,
  ADD_MEMBER: UserPlus,
  REMOVE_MEMBER: Users,
  UPDATE_ROLE: Users,
  COMMENT: MessageSquare,
  FILE_UPLOAD: FileText,
  FILE_DELETE: FileText,
};

function metadataValue(activity: ActivityLog, key: string) {
  const value = activity.metadata?.[key];
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : null;
}

export function getActivityMessage(activity: ActivityLog) {
  const actor = activity.actor.name;
  const projectName = metadataValue(activity, "projectName");
  const memberName = metadataValue(activity, "memberName");
  const taskTitle = metadataValue(activity, "taskTitle");
  const newStatus = metadataValue(activity, "newStatus");

  if (
    activity.action === "CREATE" &&
    activity.entity === "PROJECT" &&
    projectName
  ) {
    return `${actor} created project ${projectName}`;
  }
  if (activity.action === "ADD_MEMBER" && memberName && projectName) {
    return `${actor} added ${memberName} to ${projectName}`;
  }
  if (activity.action === "CHANGE_STATUS" && taskTitle && newStatus) {
    return `${actor} changed ${taskTitle} status to ${newStatus}`;
  }
  if (activity.action === "COMMENT" && taskTitle) {
    return `${actor} commented on ${taskTitle}`;
  }
  if (activity.action === "UPDATE_ROLE") return "Project role was updated";
  if (
    activity.action === "ASSIGN_TASK" ||
    metadataValue(activity, "newAssignee")
  ) {
    return "Task assignment was updated";
  }

  const entityLabel = activity.entity.toLowerCase().replace("_", " ");
  const actionLabel = activity.action.toLowerCase().replace("_", " ");
  return `${actor} ${actionLabel} ${entityLabel}`;
}

export function formatActivityTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Unknown time";

  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) return formatter.format(days, "day");
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

export function ActivityItem({
  activity,
  compact = false,
}: {
  activity: ActivityLog;
  compact?: boolean;
}) {
  const Icon = actionIcons[activity.action] ?? Activity;

  return (
    <li className="flex items-start gap-3 rounded-md px-2 py-3 hover:bg-accent/40">
      <Avatar
        name={activity.actor.name}
        src={activity.actor.avatar ?? undefined}
        className={compact ? "size-8" : "size-10"}
      />
      <div className="min-w-0">
        <p className="text-sm leading-snug text-foreground">
          {getActivityMessage(activity)}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="size-4" />
          <span>{formatActivityTime(activity.createdAt)}</span>
        </div>
      </div>
    </li>
  );
}

export default ActivityItem;
