"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  ListFilter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ActivitySkeleton } from "@/components/activity/activity-skeleton";
import {
  metadataValue,
  formatActivityTime,
  getActivityMessage,
} from "@/components/activity/activity-item";
import { useActivity } from "@/components/activity/hooks/use-activity";
import type { ActivityLog } from "@/lib/api/activity.api";
import { getProjects, type ProjectRecord } from "@/lib/api/project.api";
import {
  getWorkspaceMembers,
  type WorkspaceMemberRecord,
} from "@/lib/api/workspace.api";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ACTIVITY_FILTER_NOW = Date.now();

export default function ActivityLogsPage() {
  const [query, setQuery] = React.useState("");
  const [userId, setUserId] = React.useState("all");
  const [action, setAction] = React.useState("all");
  const [projectId, setProjectId] = React.useState("all");
  const [dateRange, setDateRange] = React.useState("all");
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">(
    "newest",
  );
  const [selected, setSelected] = React.useState<ActivityLog | null>(null);
  const [members, setMembers] = React.useState<WorkspaceMemberRecord[]>([]);
  const [projects, setProjects] = React.useState<ProjectRecord[]>([]);
  const { accessToken, isReady } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const activity = useActivity({ limit: 10 });
  const workspaceId = activeWorkspace?.id;

  React.useEffect(() => {
    if (!isReady || !accessToken || !workspaceId) {
      const timeoutId = window.setTimeout(() => {
        setMembers([]);
        setProjects([]);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    let cancelled = false;
    void Promise.allSettled([
      getWorkspaceMembers(accessToken, workspaceId),
      getProjects(accessToken, workspaceId),
    ]).then(([membersResult, projectsResult]) => {
      if (cancelled) return;
      setMembers(
        membersResult.status === "fulfilled" ? membersResult.value.data : [],
      );
      setProjects(
        projectsResult.status === "fulfilled" ? projectsResult.value.data : [],
      );
    });

    return () => {
      cancelled = true;
    };
  }, [accessToken, isReady, workspaceId]);

  const actorRoles = React.useMemo(
    () => new Map(members.map((member) => [member.userId, member.role])),
    [members],
  );
  const projectNames = React.useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects],
  );
  const getProjectName = React.useCallback(
    (item: ActivityLog) =>
      item.project?.name ??
      metadataValue(item, "projectName") ??
      projectNames.get(metadataValue(item, "projectId") ?? "") ??
      null,
    [projectNames],
  );
  const getProjectId = React.useCallback(
    (item: ActivityLog) =>
      item.project?.id ??
      metadataValue(item, "projectId") ??
      (item.entity === "PROJECT" ? item.entityId : null),
    [],
  );
  const getActorRole = React.useCallback(
    (item: ActivityLog) => actorRoles.get(item.actor.id) ?? item.actor.role,
    [actorRoles],
  );
  const userOptions = React.useMemo(
    () =>
      Array.from(
        new Map(
          activity.data.map((item) => [
            item.actor.id,
            {
              id: item.actor.id,
              name: item.actor.name,
              email: item.actor.email,
            },
          ]),
        ).values(),
      ),
    [activity.data],
  );
  const actionOptions = React.useMemo(
    () => Array.from(new Set(activity.data.map((item) => item.action))).sort(),
    [activity.data],
  );
  const projectOptions = React.useMemo(
    () =>
      Array.from(
        new Map(
          activity.data
            .map((item) => {
              const id = getProjectId(item);
              const name = getProjectName(item);
              return id && name ? ([id, name] as const) : null;
            })
            .filter(
              (value): value is readonly [string, string] => value !== null,
            ),
        ).entries(),
      ),
    [activity.data, getProjectId, getProjectName],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(activity.meta.total / activity.meta.limit),
  );
  const hasFilters = Boolean(
    query.trim() ||
    userId !== "all" ||
    action !== "all" ||
    projectId !== "all" ||
    dateRange !== "all",
  );
  const visible = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = activity.data
      .filter((item) => userId === "all" || item.actor.id === userId)
      .filter((item) => action === "all" || item.action === action)
      .filter((item) => {
        if (projectId === "none") return !getProjectId(item);
        if (projectId === "all") return true;
        return getProjectId(item) === projectId;
      })
      .filter((item) => {
        if (dateRange === "all") return true;
        const timestamp = new Date(item.createdAt).getTime();
        const rangeStart =
          ACTIVITY_FILTER_NOW - Number(dateRange) * 24 * 60 * 60 * 1000;
        return !Number.isNaN(timestamp) && timestamp >= rangeStart;
      })
      .filter((item) => {
        const searchable = [
          item.actor.name,
          item.actor.email,
          getActivityMessage(item),
          item.action,
          item.entity,
          getProjectName(item) ?? "",
        ].join(" ");
        return searchable.toLowerCase().includes(normalizedQuery);
      });

    return [...filtered].sort((left, right) => {
      const leftTimestamp = new Date(left.createdAt).getTime();
      const rightTimestamp = new Date(right.createdAt).getTime();
      const difference = leftTimestamp - rightTimestamp;
      return sortOrder === "newest" ? -difference : difference;
    });
  }, [
    action,
    activity.data,
    dateRange,
    getProjectId,
    getProjectName,
    projectId,
    query,
    sortOrder,
    userId,
  ]);

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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="size-4" />
          <span>{activity.meta.total} recorded events</span>
        </div>
      </header>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap">
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
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All users</option>
            {userOptions.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
                {user.email ? ` (${user.email})` : ""}
              </option>
            ))}
          </select>
          <select
            value={action}
            onChange={(event) => setAction(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All types</option>
            {actionOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All projects</option>
            <option value="none">No project</option>
            {projectOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All loaded dates</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as "newest" | "oldest")
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            aria-label="Sort activity by date"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
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
                  <div className="relative shrink-0">
                    <Avatar
                      name={item.actor.name}
                      src={item.actor.avatar ?? undefined}
                    />
                    <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full border-2 border-card bg-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold">{item.actor.name}</p>
                      {getActorRole(item) ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          {getActorRole(item)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.actor.email || "Email unavailable"}
                    </p>
                    <p className="mt-2 text-sm leading-snug">
                      {getActivityDescription(item)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <ListFilter className="size-3.5" /> {item.action}
                      </span>
                      {getProjectName(item) ? (
                        <span className="inline-flex items-center gap-1">
                          <FolderKanban className="size-3.5" />{" "}
                          {getProjectName(item)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <time
                    className="shrink-0 text-xs text-muted-foreground"
                    title={formatExactTime(item.createdAt)}
                  >
                    {formatActivityTime(item.createdAt)}
                  </time>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <p className="font-medium">
                {hasFilters
                  ? "No activities match your filters"
                  : "No activities found"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters, or load another activity
                page.
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
                  <p className="text-muted-foreground">
                    {selected.actor.email || "Email unavailable"}
                  </p>
                  {getActorRole(selected) ? (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {getActorRole(selected)}
                    </p>
                  ) : null}
                </div>
              </div>
              <Detail
                label="Activity"
                value={getActivityDescription(selected)}
              />
              <Detail label="Action" value={selected.action} />
              <Detail label="Entity" value={selected.entity} />
              <Detail label="Entity ID" value={selected.entityId} />
              <Detail
                label="Project"
                value={getProjectName(selected) ?? "No related project"}
              />
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

function getActivityDescription(activity: ActivityLog) {
  const message = getActivityMessage(activity);
  const actorPrefix = `${activity.actor.name} `;
  return message.startsWith(actorPrefix)
    ? message.slice(actorPrefix.length)
    : message;
}

function formatExactTime(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp)
    ? "Unknown time"
    : new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(timestamp);
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
