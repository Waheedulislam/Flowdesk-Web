"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useNotifications } from "@/context/notification-context";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getSafeNotificationDestination } from "@/lib/notification-navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isLoading,
    isMarkingAllAsRead,
    error,
    pendingIds,
    reload,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [filter, setFilter] = React.useState<"ALL" | "READ" | "UNREAD">("ALL");
  const [q, setQ] = React.useState("");

  const filtered = notifications.filter((item) => {
    if (filter === "READ" && !item.isRead) return false;
    if (filter === "UNREAD" && item.isRead) return false;
    if (
      q &&
      !`${item.title} ${item.message}`.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "We couldn't mark the notification as read.",
      );
    }
  };

  const handleOpen = async (
    notificationId: string,
    link: string | null,
    isRead: boolean,
  ) => {
    try {
      if (!isRead) await markAsRead(notificationId);
      const destination = getSafeNotificationDestination(link);
      if (destination) {
        router.push(destination);
      } else if (link) {
        toast.info("Destination unavailable", {
          description: "This notification does not link to an available page.",
        });
      }
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "We couldn't open the notification.",
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "We couldn't mark all notifications as read.",
      );
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      toast.success("Notification deleted");
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : "We couldn't delete the notification.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Recent updates, mentions, and system alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to Dashboard
          </Link>
          <div className="ml-2 text-sm text-muted-foreground">
            {unreadCount} unread
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Notifications</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search notifications…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => void handleMarkAllRead()}
              disabled={isMarkingAllAsRead || unreadCount === 0}
            >
              {isMarkingAllAsRead ? <Spinner /> : null}
              Mark all read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && notifications.length > 0 ? (
            <div className="flex flex-col gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={() => void reload()}>
                Retry
              </Button>
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <Button
              variant={filter === "ALL" ? "default" : "ghost"}
              onClick={() => setFilter("ALL")}
            >
              All
            </Button>
            <Button
              variant={filter === "UNREAD" ? "default" : "ghost"}
              onClick={() => setFilter("UNREAD")}
            >
              Unread
            </Button>
            <Button
              variant={filter === "READ" ? "default" : "ghost"}
              onClick={() => setFilter("READ")}
            >
              Read
            </Button>
            <div className="ml-auto text-sm text-muted-foreground">
              Showing {filtered.length} notifications
            </div>
          </div>

          <div className="space-y-2">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                <Spinner />
                Loading notifications...
              </div>
            ) : error && notifications.length === 0 ? (
              <div className="space-y-3 p-8 text-center text-sm">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" onClick={() => void reload()}>
                  Try again
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              filtered.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  isPending={pendingIds.has(item.id)}
                  onOpen={() =>
                    void handleOpen(item.id, item.link, item.isRead)
                  }
                  onMarkRead={() => void handleMarkRead(item.id)}
                  onDelete={() => void handleDelete(item.id)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
