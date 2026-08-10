import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ProjectProgressBar } from "@/components/projects/project-progress";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectItem } from "@/lib/projects-data";

interface ProjectCardProps {
  project: ProjectItem;
  onOpen: (project: ProjectItem) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <Card
      className="h-full cursor-pointer transition-colors hover:border-primary/30"
      onClick={() => onOpen(project)}
    >
      <CardHeader
        className={`rounded-t-xl bg-linear-to-r ${project.color} p-4`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{project.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <ProjectProgressBar
            progress={project.progress}
            status={project.status}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border/70 bg-background/70 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Tasks
            </p>
            <p className="mt-1 font-semibold">
              {project.completedTasks}/{project.totalTasks}
            </p>
          </div>
          <div className="rounded-lg border border-border/70 bg-background/70 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Owner
            </p>
            <p className="mt-1 font-semibold">{project.owner}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Updated {project.updatedAt}</span>
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <Avatar
                key={member.id}
                name={member.name}
                className="size-8 border-2 border-background"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
