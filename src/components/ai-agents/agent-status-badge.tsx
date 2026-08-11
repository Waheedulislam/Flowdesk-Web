import { CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AgentStatus } from "@/lib/ai-agents-data";

export function AgentStatusBadge({ status }: { status: AgentStatus }) { const variant = status === "active" ? "success" : status === "paused" ? "warning" : "secondary"; return <Badge variant={variant}><CircleDot className="size-3" />{status[0].toUpperCase() + status.slice(1)}</Badge>; }
