import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Execution } from "@/lib/workflows-data";

export function WorkflowExecutionHistory({ executions }: { executions: Execution[] }) {
  const icon = { success: <CheckCircle2 className="size-3" />, failed: <XCircle className="size-3" />, running: <Clock3 className="size-3" /> };
  const variant = { success: "success", failed: "destructive", running: "info" } as const;
  return <Card><CardHeader className="pb-3"><CardTitle>Execution history</CardTitle><p className="text-sm text-muted-foreground">Recent mock workflow runs. No executions are performed.</p></CardHeader><CardContent className="overflow-x-auto p-0"><table className="w-full min-w-[650px] text-sm"><thead className="border-y bg-muted/40 text-left text-xs text-muted-foreground"><tr><th className="px-6 py-3 font-medium">Trigger</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Started</th><th className="px-4 py-3 font-medium">Completed</th><th className="px-4 py-3 font-medium">Duration</th><th className="px-6 py-3 font-medium">Steps</th></tr></thead><tbody>{executions.map((run) => <tr key={run.id} className="border-b last:border-0"><td className="px-6 py-4 font-medium">{run.trigger}</td><td className="px-4 py-4"><Badge variant={variant[run.status]}>{icon[run.status]}{run.status[0].toUpperCase() + run.status.slice(1)}</Badge></td><td className="px-4 py-4 text-muted-foreground">{run.startedAt}</td><td className="px-4 py-4 text-muted-foreground">{run.completedAt}</td><td className="px-4 py-4 text-muted-foreground">{run.duration}</td><td className="px-6 py-4 text-muted-foreground">{run.stepsExecuted}</td></tr>)}</tbody></table></CardContent></Card>;
}
