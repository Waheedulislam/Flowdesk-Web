"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { getActivityMessage } from "@/components/activity/activity-item";
import { useActivity } from "@/components/activity/hooks/use-activity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ActivityPage() {
  const [query, setQuery] = React.useState("");
  const activity = useActivity({ limit: 10 });
  const visibleActivities = activity.data.filter((item) =>
    `${item.actor.name} ${getActivityMessage(item)} ${item.entity}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const totalPages = Math.max(
    1,
    Math.ceil(activity.meta.total / activity.meta.limit),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activity</h1>
          <p className="text-sm text-muted-foreground">
            Workspace activity feed and timeline
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to Dashboard
        </Link>
      </div>
      <div className="rounded-xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-semibold">Activity</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search loaded activity..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {(["User", "Type", "Project", "Date"] as const).map((label) => (
              <Button
                key={label}
                variant="ghost"
                disabled
                title={`${label} filtering is not available yet`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <ActivityFeed
            activities={visibleActivities}
            loading={activity.loading}
            error={activity.error}
            emptyMessage={
              query ? "No matching activity on this page." : undefined
            }
          />
          {!activity.loading && !activity.error && activity.meta.total > 0 ? (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Page {activity.page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous activity page"
                  disabled={!activity.hasPreviousPage}
                  onClick={() => activity.setPage((page) => page - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next activity page"
                  disabled={!activity.hasNextPage}
                  onClick={() => activity.setPage((page) => page + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
