import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectProgressBar } from "@/components/projects/project-progress";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectItem } from "@/lib/projects-data";

interface ProjectTableProps {
  projects: ProjectItem[];
  onOpen: (project: ProjectItem) => void;
}

export function ProjectTable({ projects, onOpen }: ProjectTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden px-0 md:px-6">
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Progress</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="cursor-pointer border-t border-border/70 align-middle"
                  onClick={() => onOpen(project)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ProjectStatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <ProjectProgressBar
                        progress={project.progress}
                        status={project.status}
                      />
                      <p className="text-xs text-muted-foreground">
                        {project.completedTasks}/{project.totalTasks} tasks
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{project.owner}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {project.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 px-4 pb-2 md:hidden">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-border bg-background p-4"
              onClick={() => onOpen(project)}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
              <div className="mt-3 space-y-2">
                <ProjectProgressBar
                  progress={project.progress}
                  status={project.status}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {project.completedTasks}/{project.totalTasks} tasks
                  </span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
