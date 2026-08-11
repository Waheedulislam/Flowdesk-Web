"use client";

import * as React from "react";
import { Bell, X, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { recentNotifications } from "@/lib/dashboard-data";
import { NotificationItem } from "./notification-item";

export function NotificationBell() {
  const [items, setItems] = React.useState(recentNotifications);

  const unreadCount = items.filter((i) => !i.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((p) => ({ ...p, read: true })));
    // TODO: Connect mark-all-as-read API
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
        )}
      >
        <Bell />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -right-0.5 -top-0.5">
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] max-w-[90vw] p-0">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <p className="text-xs text-muted-foreground">
              Recent activity in your workspace
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={markAllRead}>
              <Check className="mr-2" /> Mark all read
            </Button>
            <Button size="sm" variant="ghost">
              <X />
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          {items.map((it) => (
            <NotificationItem
              key={it.id}
              item={it}
              onMarkRead={() =>
                setItems((prev) =>
                  prev.map((p) => (p.id === it.id ? { ...p, read: true } : p)),
                )
              }
              onDelete={() =>
                setItems((prev) => prev.filter((p) => p.id !== it.id))
              }
            />
          ))}

          {items.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-3 py-2">
          <a
            href="/notifications"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all notifications
          </a>
          <span className="text-xs text-muted-foreground">
            Show recent updates
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
