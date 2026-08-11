"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { notificationTone } from "@/lib/dashboard-data";
import type { NotificationItem as NItem } from "@/lib/dashboard-data";

export function NotificationItem({
  item,
  onMarkRead,
  onDelete,
}: {
  item: NItem;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const tone = notificationTone[item.type];
  const toneToBadge: Record<
    string,
    React.ComponentProps<typeof Badge>["variant"]
  > = {
    primary: "default",
    success: "success",
    warning: "warning",
    info: "info",
    destructive: "destructive",
    muted: "secondary",
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 hover:bg-accent/40 ${item.read ? "opacity-80" : "bg-background/0"}`}
    >
      <div className="pt-1">
        <Avatar
          name={item.title}
          className={`size-9 border border-border/60 bg-background/90`}
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-5 text-foreground line-clamp-2">
              {item.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {item.message}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
            <div className="mt-2 flex items-center justify-end gap-2">
              {!item.read && (
                <button
                  className="text-xs text-primary underline"
                  onClick={onMarkRead}
                >
                  Mark read
                </button>
              )}
              <button
                className="text-xs text-muted-foreground underline"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge
            className="whitespace-nowrap"
            variant={toneToBadge[tone] || "default"}
          >
            {item.type.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
