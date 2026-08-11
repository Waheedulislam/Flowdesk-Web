"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, MoreHorizontal, Pause, Play, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { WorkflowBuilder } from "@/components/workflows/workflow-builder";
import { WorkflowExecutionHistory } from "@/components/workflows/workflow-execution-history";
import { WorkflowStatusBadge } from "@/components/workflows/workflow-status-badge";
import { mockExecutions, mockWorkflows, type WorkflowStep, type WorkflowStatus } from "@/lib/workflows-data";
import { cn } from "@/lib/utils";

const initialSteps: WorkflowStep[] = [{ id: "new-condition", kind: "condition", title: "Check priority", field: "Priority", operator: "is", value: "High" }, { id: "new-action", kind: "action", title: "Send notification", action: "Send notification", recipient: "Project team", message: "" }];

export function WorkflowEditorPage({ mode, workflowId }: { mode: "create" | "detail"; workflowId?: string }) {
  const source = mockWorkflows.find((workflow) => workflow.id === workflowId);
  const [name, setName] = React.useState(source?.name ?? "");
  const [description, setDescription] = React.useState(source?.description ?? "");
  const [trigger, setTrigger] = React.useState(source?.trigger ?? "Task status changed");
  const [steps, setSteps] = React.useState(source?.steps ?? initialSteps);
  const [status, setStatus] = React.useState<WorkflowStatus>(source?.status ?? "draft");
  const isCreate = mode === "create";
  const save = () => {
    // TODO: Connect create-workflow API
    // TODO: Connect update-workflow API
    toast.success(isCreate ? "Workflow created locally" : "Workflow saved locally", { description: "This UI does not execute workflows." });
  };
  const toggle = () => {
    // TODO: Connect workflow enable/disable API
    setStatus((current) => current === "active" ? "paused" : "active");
  };
  const title = isCreate ? "Create Workflow" : source?.name ?? "Workflow not found";
  return <AppShell><div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
    <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><Link href="/workflows" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Workflows</Link><div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold tracking-tight">{title}</h1>{!isCreate && <WorkflowStatusBadge status={status} />}</div><p className="mt-1 text-sm text-muted-foreground">{isCreate ? "Build a rule to keep your workspace moving." : "Configure this workflow and review its recent activity."}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={toggle}>{status === "active" ? <Pause /> : <Play />}{status === "active" ? "Pause" : "Activate"}</Button><Button onClick={save}><Save />{isCreate ? "Create workflow" : "Save changes"}</Button>{!isCreate && <DropdownMenu><DropdownMenuTrigger aria-label="More workflow actions" className="inline-flex size-9 items-center justify-center rounded-md border border-input hover:bg-accent"><MoreHorizontal /></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={() => toast.success("Workflow duplicated locally")}><Copy />Duplicate</DropdownMenuItem><DropdownMenuItem variant="destructive" onClick={() => { /* TODO: Connect delete-workflow API */ toast.info("Delete is a UI-only placeholder"); }}><Trash2 />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}</div></header>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]"><main className="min-w-0 space-y-6"><Card><CardHeader className="pb-3"><CardTitle>Workflow details</CardTitle></CardHeader><CardContent className="grid gap-4"><label className="grid gap-1.5 text-sm font-medium">Workflow name<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. High priority task alert" /></label><label className="grid gap-1.5 text-sm font-medium">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what this workflow does" className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring" /></label></CardContent></Card><section><div className="mb-3"><h2 className="font-semibold">Workflow builder</h2><p className="text-sm text-muted-foreground">Drag steps to reorder. Changes stay in this browser session.</p></div><WorkflowBuilder trigger={trigger} onTriggerChange={setTrigger} steps={steps} onStepsChange={setSteps} /></section></main><aside className="space-y-4"><Card><CardContent className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workflow summary</p><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Trigger</dt><dd className="text-right font-medium">{trigger}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Steps</dt><dd className="font-medium">{steps.length}</dd></div>{!isCreate && <><div className="flex justify-between"><dt className="text-muted-foreground">Created by</dt><dd className="font-medium">{source?.createdBy}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Created</dt><dd className="font-medium">{source?.createdAt}</dd></div><div className="flex justify-between"><dt className="text-muted-foreground">Last updated</dt><dd className="font-medium">{source?.updatedAt}</dd></div></>}</dl></CardContent></Card><div className={cn("rounded-lg border p-4 text-sm", status === "active" ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/10")}><div className="flex items-center gap-2 font-medium"><Check className="size-4" />{status === "active" ? "Workflow is active" : "Workflow is paused"}</div><p className="mt-1 text-muted-foreground">{status === "active" ? "It will run when its trigger occurs." : "It will not run until reactivated."}</p></div></aside></div>
    {!isCreate && <WorkflowExecutionHistory executions={mockExecutions.filter((execution) => execution.workflow === source?.name)} />}
  </div></AppShell>;
}
