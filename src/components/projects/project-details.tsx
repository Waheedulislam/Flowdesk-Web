import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ProjectMembersSection } from "@/components/projects/project-members-section";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectRecord } from "@/lib/api/project.api";
import type { ActivityLog } from "@/lib/api/activity.api";
import type { TaskRecord } from "@/lib/api/task.api";
import type { WorkspaceMemberRole } from "@/lib/api/workspace.api";

export function ProjectDetails({
  project,
  tasks,
  tasksLoading,
  tasksError,
  onRetryTasks,
  activities,
  activityLoading,
  activityError,
  onRetryActivity,
  canManage,
  workspaceRole,
  onEdit,
  onBack,
  onOpenTask,
}: {
  project: ProjectRecord;
  tasks: TaskRecord[];
  tasksLoading: boolean;
  tasksError: string | null;
  onRetryTasks: () => void;
  activities: ActivityLog[];
  activityLoading: boolean;
  activityError: string | null;
  onRetryActivity: () => void;
  canManage: boolean;
  workspaceRole: WorkspaceMemberRole;
  onEdit: () => void;
  onBack: () => void;
  onOpenTask?: (taskId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-3">
            Back to projects
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h2>
            <ProjectStatusBadge status={project.status} />
          </div>
          {project.description && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        {canManage && (
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Info
            label="Created"
            value={new Date(project.createdAt).toLocaleString()}
          />
          <Info
            label="Last updated"
            value={new Date(project.updatedAt).toLocaleString()}
          />
          <Info
            label="Creator"
            value={project.creator?.name ?? "Unavailable"}
          />
          <Info
            label="Creator email"
            value={project.creator?.email ?? "Unavailable"}
          />
        </CardContent>
      </Card>
      <ProjectMembersSection
        projectId={project.id}
        workspaceId={project.workspaceId}
        workspaceRole={workspaceRole}
      />
      <Card>
        <CardHeader>
          <CardTitle>Project tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <p className="text-sm text-muted-foreground">Loading tasks...</p>
          ) : null}
          {!tasksLoading && tasksError ? (
            <ErrorState message={tasksError} onRetry={onRetryTasks} />
          ) : null}
          {!tasksLoading && !tasksError && !tasks.length ? (
            <EmptyState message="No tasks belong to this project yet." />
          ) : null}
          {!tasksLoading && !tasksError && tasks.length ? (
            <div className="divide-y divide-border/70">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between ${onOpenTask ? "cursor-pointer rounded-lg px-2 hover:bg-accent/40" : ""}`}
                  onClick={() => onOpenTask?.(task.id)}
                  role={onOpenTask ? "link" : undefined}
                  tabIndex={onOpenTask ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (
                      onOpenTask &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      onOpenTask(task.id);
                    }
                  }}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.assignee?.name ?? "Unassigned"}
                      {task.dueDate ? ` - Due ${formatDate(task.dueDate)}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Badge variant="secondary">{task.priority}</Badge>
                    <Badge
                      variant={task.status === "DONE" ? "success" : "info"}
                    >
                      {task.status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
      <ActivityFeed
        title="Project activity"
        activities={activities}
        loading={activityLoading}
        error={activityError}
        emptyMessage="No project-specific activity is available yet."
        action={
          activityError ? (
            <Button variant="outline" size="sm" onClick={onRetryActivity}>
              Try again
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : date.toLocaleDateString();
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-destructive">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-4 text-center text-sm text-muted-foreground">{message}</p>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/70 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
