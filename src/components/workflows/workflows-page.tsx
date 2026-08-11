"use client";

import * as React from "react";
import Link from "next/link";
import { Filter, Plus, Search, Workflow as WorkflowIcon } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { mockWorkflows, type Workflow, type WorkflowStatus } from "@/lib/workflows-data";

export function WorkflowsPage() {
  const [workflows, setWorkflows] = React.useState(mockWorkflows);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<"all" | WorkflowStatus>("all");
  const visible = workflows.filter((workflow) => (status === "all" || workflow.status === status) && `${workflow.name} ${workflow.description} ${workflow.trigger}`.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id: string) => {
    // TODO: Connect workflow enable/disable API
    setWorkflows((items) => items.map((item) => item.id === id ? { ...item, status: item.status === "active" ? "paused" : "active" } : item));
  };
  return <AppShell><div className="flex flex-col gap-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Automation</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Workflow Automation</h1><p className="mt-2 text-sm text-muted-foreground">Automate repetitive work across your workspace.</p></div><Link href="/workflows/new" className={buttonVariants({ variant: "default" })}><Plus className="size-4" />Create workflow</Link></header>
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search workflows" className="pl-9" /></div><div className="flex items-center gap-2"><Filter className="size-4 text-muted-foreground" /><select value={status} onChange={(event) => setStatus(event.target.value as "all" | WorkflowStatus)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="all">All statuses</option><option value="active">Active</option><option value="paused">Paused</option><option value="draft">Draft</option></select></div></div>
    {visible.length ? <div className="grid gap-4 xl:grid-cols-2">{visible.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} onToggle={toggle} />)}</div> : <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center"><WorkflowIcon className="size-8 text-muted-foreground" /><h2 className="mt-3 font-semibold">No workflows found</h2><p className="mt-1 text-sm text-muted-foreground">Try changing your filters or create a new workflow.</p></div>}
  </div></AppShell>;
}
