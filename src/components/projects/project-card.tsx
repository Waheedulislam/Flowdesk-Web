import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectRecord } from "@/lib/api/project.api";

const headerTints: Record<ProjectRecord["status"], string> = {
  PLANNING:
    "from-slate-200/80 to-slate-50/80 dark:from-slate-800/70 dark:to-slate-950/30",
  ACTIVE:
    "from-emerald-200/70 to-emerald-50/80 dark:from-emerald-900/50 dark:to-emerald-950/20",
  IN_PROGRESS:
    "from-sky-200/70 to-sky-50/80 dark:from-sky-900/50 dark:to-sky-950/20",
  ON_HOLD:
    "from-amber-200/70 to-amber-50/80 dark:from-amber-900/50 dark:to-amber-950/20",
  COMPLETED:
    "from-violet-200/70 to-violet-50/80 dark:from-violet-900/50 dark:to-violet-950/20",
  ARCHIVED:
    "from-zinc-200/70 to-zinc-50/80 dark:from-zinc-800/60 dark:to-zinc-950/20",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/70 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

export function ProjectCard({
  project,
  onOpen,
}: {
  project: ProjectRecord;
  onOpen: (project: ProjectRecord) => void;
}) {
  return (
    <Card
      className="h-full cursor-pointer overflow-hidden transition-colors hover:border-primary/30"
      onClick={() => onOpen(project)}
    >
      <CardHeader
        className={`bg-linear-to-r p-5 ${headerTints[project.status]}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="wrap-break-word text-base leading-6">
              {project.name}
            </CardTitle>
            <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
              {project.description || "No description available"}
            </p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        <section aria-label="Project progress">
          <div className="flex items-center justify-between text-sm">
            <p className="font-medium">Progress</p>
            <p className="font-semibold text-muted-foreground">—</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-0 rounded-full bg-primary" />
          </div>
        </section>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Tasks" value="—" />
          <Stat label="Owner" value="—" />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          <span>Updated {formatDate(project.updatedAt)}</span>
          <div className="flex size-8 items-center justify-center rounded-full border border-dashed border-border text-[10px] font-semibold">
            —
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
