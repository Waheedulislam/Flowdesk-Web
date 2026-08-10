import { Progress } from "@/components/ui/progress";
import type { ProjectStatus } from "@/lib/dashboard-data";

interface ProjectProgressProps {
  progress: number;
  status: ProjectStatus;
}

export function ProjectProgressBar({ progress, status }: ProjectProgressProps) {
  const tone = {
    ON_TRACK: "success" as const,
    AT_RISK: "warning" as const,
    DELAYED: "destructive" as const,
    COMPLETED: "info" as const,
  }[status];

  return <Progress value={progress} tone={tone} />;
}
