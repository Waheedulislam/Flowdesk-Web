"use client";

import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";
import { ActivitySkeleton } from "@/components/activity/activity-skeleton";
import {
  formatActivityTime,
  getActivityMessage,
} from "@/components/activity/activity-item";
import { useActivity } from "@/components/activity/hooks/use-activity";
import type { ActivityLog } from "@/lib/api/activity.api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ActivityLogsPage() {
  const [query, setQuery] = React.useState("");
  const [entity, setEntity] = React.useState("All entities");
  const [selected, setSelected] = React.useState<ActivityLog | null>(null);
  const activity = useActivity({ limit: 10 });
  const totalPages = Math.max(
    1,
    Math.ceil(activity.meta.total / activity.meta.limit),
  );
  const visible = activity.data
    .filter((item) => entity === "All entities" || item.entity === entity)
    .filter((item) =>
      `${item.actor.name} ${getActivityMessage(item)} ${item.entityId}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Activity Logs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Workspace activity and important changes across your team.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled
            title="Backend filtering is not available yet"
          >
            <Filter /> Filter
          </Button>
          <Button
            variant="outline"
            disabled
            title="Backend date filtering is not available yet"
          >
            <CalendarDays /> Last 30 days
          </Button>
        </div>
      </header>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search loaded activity..."
            />
          </div>
          <select
            value={entity}
            onChange={(event) => setEntity(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>All entities</option>
            <option value="PROJECT">Projects</option>
            <option value="PROJECT_MEMBER">Members</option>
            <option value="TASK">Tasks</option>
            <option value="COMMENT">Comments</option>
            <option value="INVITATION">Invitations</option>
            <option value="FILE">Files</option>
          </select>
          <select
            disabled
            title="Backend date filtering is not available yet"
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>All loaded dates</option>
          </select>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          {activity.loading ? (
            <div className="p-5">
              <ActivitySkeleton rows={5} />
            </div>
          ) : activity.error ? (
            <div className="px-6 py-16 text-center">
              <p className="font-medium text-destructive">{activity.error}</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => void activity.reload()}
              >
                Try again
              </Button>
            </div>
          ) : visible.length ? (
            <div className="divide-y">
              {visible.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/50"
                >
                  <div className="relative">
                    <Avatar
                      name={item.actor.name}
                      src={item.actor.avatar ?? undefined}
                    />
                    <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full border-2 border-card bg-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {getActivityMessage(item)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.entity.replace("_", " ")}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {formatActivityTime(item.createdAt)}
                  </time>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="font-medium">No activity found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or entity filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {!activity.loading && !activity.error && activity.meta.total > 0 ? (
        <div className="flex items-center justify-between">
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
      {selected ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-foreground/20 p-3"
          role="dialog"
          aria-modal="true"
        >
          <aside className="h-full w-full max-w-md overflow-y-auto rounded-xl border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">Activity details</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A closer look at this workspace update.
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelected(null)}
                aria-label="Close details"
              >
                <X />
              </Button>
            </div>
            <div className="mt-8 space-y-5 text-sm">
              <div className="flex items-center gap-3">
                <Avatar
                  name={selected.actor.name}
                  src={selected.actor.avatar ?? undefined}
                />
                <div>
                  <p className="font-medium">{selected.actor.name}</p>
                  <p className="text-muted-foreground">Workspace member</p>
                </div>
              </div>
              <Detail label="Activity" value={getActivityMessage(selected)} />
              <Detail label="Action" value={selected.action} />
              <Detail label="Entity" value={selected.entity} />
              <Detail label="Entity ID" value={selected.entityId} />
              <Detail
                label="Date and time"
                value={new Date(selected.createdAt).toLocaleString()}
              />
              <Detail
                label="Metadata"
                value={
                  selected.metadata
                    ? JSON.stringify(selected.metadata, null, 2)
                    : "No additional metadata"
                }
              />
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap wrap-break-word leading-6">
        {value}
      </p>
    </div>
  );
}
