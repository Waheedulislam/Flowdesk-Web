import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/dashboard-data";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const meta: Record<ProjectStatus, BadgeProps["variant"]> = {
    ON_TRACK: "success",
    AT_RISK: "warning",
    DELAYED: "destructive",
    COMPLETED: "info",
  };

  const labels: Record<ProjectStatus, string> = {
    ON_TRACK: "On track",
    AT_RISK: "At risk",
    DELAYED: "Delayed",
    COMPLETED: "Completed",
  };

  return <Badge variant={meta[status]}>{labels[status]}</Badge>;
}
