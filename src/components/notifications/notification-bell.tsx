"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useNotifications } from "@/context/notification-context";
import { getSafeNotificationDestination } from "@/lib/notification-navigation";
import { cn } from "@/lib/utils";
import { NotificationItem } from "./notification-item";

export function NotificationBell() {
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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => void handleMarkAllRead()}
              disabled={isMarkingAllAsRead || unreadCount === 0}
            >
              {isMarkingAllAsRead ? <Spinner /> : <Check />}
              Mark all read
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto">
          {error && notifications.length > 0 ? (
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-xs">
              <span className="text-destructive">{error}</span>
              <Button size="sm" variant="outline" onClick={() => void reload()}>
                Retry
              </Button>
            </div>
          ) : null}
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
              <Spinner />
              Loading notifications...
            </div>
          ) : error && notifications.length === 0 ? (
            <div className="space-y-3 p-6 text-center text-sm">
              <p className="text-destructive">{error}</p>
              <Button size="sm" variant="outline" onClick={() => void reload()}>
                Try again
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                isPending={pendingIds.has(item.id)}
                onOpen={() => void handleOpen(item.id, item.link, item.isRead)}
                onMarkRead={() => void handleMarkRead(item.id)}
                onDelete={() => void handleDelete(item.id)}
              />
            ))
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-3 py-2">
          <Link
            href="/notifications"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all notifications
          </Link>
          <span className="text-xs text-muted-foreground">
            Show recent updates
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationBell;
