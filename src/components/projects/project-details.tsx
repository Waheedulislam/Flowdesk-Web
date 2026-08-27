import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectMembersSection } from "@/components/projects/project-members-section";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectRecord } from "@/lib/api/project.api";
import type { ProjectTaskStatistics } from "@/lib/project-task-statistics";
import type { WorkspaceMemberRole } from "@/lib/api/workspace.api";

export function ProjectDetails({
  project,
  statistics,
  taskStatisticsError,
  onRetryTaskStatistics,
  canManage,
  workspaceRole,
  onEdit,
  onBack,
}: {
  project: ProjectRecord;
  statistics?: ProjectTaskStatistics;
  taskStatisticsError?: string | null;
  onRetryTaskStatistics?: () => void;
  canManage: boolean;
  workspaceRole: WorkspaceMemberRole;
  onEdit: () => void;
  onBack: () => void;
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
        </CardContent>
      </Card>
      <ProjectMembersSection
        projectId={project.id}
        workspaceId={project.workspaceId}
        workspaceRole={workspaceRole}
      />
      <Card>
        <CardHeader>
          <CardTitle>Tasks, members, and activity</CardTitle>
        </CardHeader>
        <CardContent>
          {statistics ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Info label="Tasks" value={String(statistics.totalTasks)} />
              <Info
                label="Completed"
                value={String(statistics.completedTasks)}
              />
              <Info label="Progress" value={`${statistics.progress}%`} />
              <Info
                label="To do"
                value={String(statistics.statusCounts.TODO)}
              />
              <Info
                label="In progress"
                value={String(statistics.statusCounts.IN_PROGRESS)}
              />
              <Info
                label="In review"
                value={String(statistics.statusCounts.IN_REVIEW)}
              />
              <Info label="Done" value={String(statistics.statusCounts.DONE)} />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {taskStatisticsError
                  ? "Unable to load task statistics."
                  : "Task statistics are loading."}
              </p>
              {taskStatisticsError && onRetryTaskStatistics && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetryTaskStatistics}
                >
                  Try again
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
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
