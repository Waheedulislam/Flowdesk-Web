import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notificationTone, type NotificationItem } from "@/lib/dashboard-data";
import { toneDot } from "./tone-styles";

/**
 * Compact list of recent notifications with read/unread affordance and a
 * "View all" link. Presentational only — the link is disabled until the
 * notifications route ships.
 */

interface NotificationPreviewProps {
  notifications: NotificationItem[];
  action?: React.ReactNode;
}

function NotificationPreview({
  notifications,
  action,
}: NotificationPreviewProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>
          Notifications
          {unread > 0 ? (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {unread} new
            </span>
          ) : null}
        </CardTitle>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {notifications.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50",
                !item.read && "bg-accent/30",
              )}
            >
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  item.read
                    ? "bg-transparent"
                    : toneDot[notificationTone[item.type]],
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      "truncate text-sm",
                      item.read
                        ? "font-normal text-foreground"
                        : "font-medium text-foreground",
                    )}
                  >
                    {item.title}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.timestamp}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {item.message}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export { NotificationPreview };
