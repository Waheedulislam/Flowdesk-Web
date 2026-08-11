import { CircleDot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { WorkflowStatus } from "@/lib/workflows-data";

export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const variant =
    status === "active" ? "success" : status === "paused" ? "warning" : "secondary";

  return (
    <Badge variant={variant} className="h-6 px-2.5 shadow-none">
      <CircleDot className="size-3" />
      {status[0].toUpperCase() + status.slice(1)}
    </Badge>
  );
}
