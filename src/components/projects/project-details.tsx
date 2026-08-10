import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type {
  ProjectActivityItem,
  ProjectItem,
  ProjectTaskSummary,
} from "@/lib/projects-data";

interface ProjectDetailsProps {
  project: ProjectItem;
  activity: ProjectActivityItem[];
  tasks: ProjectTaskSummary[];
  onBack: () => void;
}

export function ProjectDetails({
  project,
  activity,
  tasks,
  onBack,
}: ProjectDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-3">
            ← Back to projects
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h2>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button>Quick actions</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} tone="primary" />
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tasks
                  </p>
                  <p className="mt-1 font-semibold">{project.totalTasks}</p>
                </div>
                <div className="rounded-lg border border-border bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Completed
                  </p>
                  <p className="mt-1 font-semibold">{project.completedTasks}</p>
                </div>
                <div className="rounded-lg border border-border bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Owner
                  </p>
                  <p className="mt-1 font-semibold">{project.owner}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.assignee}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {task.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-background/70 p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} className="size-9" />
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/70 bg-background/70 p-3"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
