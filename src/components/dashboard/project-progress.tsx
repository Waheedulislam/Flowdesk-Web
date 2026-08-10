import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type {
  ProjectProgressItem,
  ProjectStatus,
  Tone,
} from "@/lib/dashboard-data";

/**
 * Per-project progress list: name, status badge, a progress bar, and a
 * completed/total task count. Presentational only.
 */

const statusMeta: Record<
  ProjectStatus,
  { label: string; variant: BadgeProps["variant"]; tone: Tone }
> = {
  ON_TRACK: { label: "On track", variant: "success", tone: "success" },
  AT_RISK: { label: "At risk", variant: "warning", tone: "warning" },
  DELAYED: { label: "Delayed", variant: "destructive", tone: "destructive" },
  COMPLETED: { label: "Completed", variant: "info", tone: "info" },
};

interface ProjectProgressProps {
  projects: ProjectProgressItem[];
}

function ProjectProgress({ projects }: ProjectProgressProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {projects.map((project) => {
          const meta = statusMeta[project.status];
          return (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-foreground">
                  {project.name}
                </span>
                <Badge variant={meta.variant}>{meta.label}</Badge>
              </div>
              <Progress value={project.progress} tone={meta.tone} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="tabular-nums">
                  {project.completedTasks}/{project.totalTasks} tasks
                </span>
                <span className="font-medium tabular-nums text-foreground">
                  {project.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { ProjectProgress };
