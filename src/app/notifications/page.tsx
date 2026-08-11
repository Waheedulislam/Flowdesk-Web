"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { recentNotifications } from "@/lib/dashboard-data";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  // TODO: Replace with notifications API
  const [items, setItems] = React.useState(recentNotifications);
  const [filter, setFilter] = React.useState<"ALL" | "READ" | "UNREAD">("ALL");
  const [q, setQ] = React.useState("");

  const filtered = items.filter((it) => {
    if (filter === "READ" && !it.read) return false;
    if (filter === "UNREAD" && it.read) return false;
    if (
      q &&
      !`${it.title} ${it.message}`.toLowerCase().includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  const markAllRead = () =>
    setItems((prev) => prev.map((p) => ({ ...p, read: true })));

  return (
    <div className="space-y-6 p-6">
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
            {items.filter((i) => !i.read).length} unread
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
            <Button variant="ghost" onClick={() => setItems([])}>
              Clear
            </Button>
            <Button variant="outline" onClick={markAllRead}>
              Mark all read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
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
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              filtered.map((it) => (
                <NotificationItem
                  key={it.id}
                  item={it}
                  onMarkRead={() =>
                    setItems((prev) =>
                      prev.map((p) =>
                        p.id === it.id ? { ...p, read: true } : p,
                      ),
                    )
                  }
                  onDelete={() =>
                    setItems((prev) => prev.filter((p) => p.id !== it.id))
                  }
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
