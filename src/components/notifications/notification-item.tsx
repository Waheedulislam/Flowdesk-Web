"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  FolderKanban,
  FolderPlus,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserMinus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type {
  NotificationRecord,
  NotificationType,
} from "@/lib/api/notification.api";
import { cn } from "@/lib/utils";

type NotificationTone =
  | "primary"
  | "success"
  | "warning"
  | "info"
  | "destructive";

const presentation: Record<
  NotificationType,
  { icon: LucideIcon; tone: NotificationTone; label: string }
> = {
  TASK_ASSIGNED: {
    icon: ClipboardCheck,
    tone: "primary",
    label: "Task assigned",
  },
  TASK_UPDATED: { icon: RefreshCw, tone: "info", label: "Task updated" },
  TASK_COMMENT: { icon: MessageCircle, tone: "info", label: "Task comment" },
  TASK_DELETED: { icon: Trash2, tone: "destructive", label: "Task deleted" },
  WORKSPACE_INVITATION: {
    icon: Users,
    tone: "warning",
    label: "Workspace invitation",
  },
  PROJECT_CREATED: {
    icon: FolderPlus,
    tone: "success",
    label: "Project created",
  },
  PROJECT_UPDATED: {
    icon: FolderKanban,
    tone: "info",
    label: "Project updated",
  },
  PROJECT_MEMBER_REMOVED: {
    icon: UserMinus,
    tone: "destructive",
    label: "Project member removed",
  },
  PROJECT_ROLE_UPDATED: {
    icon: ShieldCheck,
    tone: "warning",
    label: "Project role updated",
  },
};

const toneStyles: Record<NotificationTone, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning-foreground",
  info: "bg-info/12 text-info",
  destructive: "bg-destructive/12 text-destructive",
};

const toneToBadge: Record<
  NotificationTone,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  primary: "default",
  success: "success",
  warning: "warning",
  info: "info",
  destructive: "destructive",
};

export function formatNotificationTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Unknown time";

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (seconds < 172800) return "Yesterday";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

export function NotificationItem({
  item,
  onOpen,
  onMarkRead,
  onDelete,
  isPending = false,
}: {
  item: NotificationRecord;
  onOpen?: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
  isPending?: boolean;
}) {
  const { icon: Icon, tone, label } = presentation[item.type];
  const handleOpenKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen?.();
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 hover:bg-accent/40",
        !item.isRead && "bg-background/0",
        onOpen && "cursor-pointer",
      )}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={onOpen ? handleOpenKeyDown : undefined}
    >
      <div
        className={cn(
          "mt-1 flex size-9 shrink-0 items-center justify-center rounded-full",
          toneStyles[tone],
        )}
        aria-hidden
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm leading-5 text-foreground line-clamp-2",
                item.isRead ? "font-normal" : "font-semibold",
              )}
            >
              {item.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {item.message}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-muted-foreground">
              {formatNotificationTime(item.createdAt)}
            </p>
            <div className="mt-2 flex items-center justify-end gap-2">
              {!item.isRead && (
                <button
                  type="button"
                  className="text-xs text-primary underline"
                  disabled={isPending}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMarkRead();
                  }}
                >
                  {isPending ? "Saving..." : "Mark read"}
                </button>
              )}
              <button
                type="button"
                className="text-xs text-muted-foreground underline"
                disabled={isPending}
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete();
                }}
              >
                {isPending ? "Working..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge
            className="whitespace-nowrap"
            variant={toneToBadge[tone] || "default"}
          >
            {label}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
