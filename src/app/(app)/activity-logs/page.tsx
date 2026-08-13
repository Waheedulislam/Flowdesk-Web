"use client";

import * as React from "react";
import { CalendarDays, Filter, Search, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const activity = [
  { name: "Grace Hopper", action: "completed", resource: "Design landing hero", time: "10 minutes ago", type: "Tasks", project: "Website refresh", details: "Moved the task to Done and added final design notes." },
  { name: "Alan Turing", action: "updated", resource: "API rate limiting", time: "38 minutes ago", type: "Projects", project: "Platform API", details: "Changed the project status and updated the delivery date." },
  { name: "Katherine Johnson", action: "mentioned you in", resource: "Q3 launch checklist", time: "1 hour ago", type: "Members", project: "Q3 launch", details: "Can you review the launch checklist before tomorrow’s stand-up?" },
  { name: "Margaret Hamilton", action: "created automation", resource: "Escalate overdue tasks", time: "3 hours ago", type: "Automations", project: "Operations", details: "Automation triggers when a task passes its due date." },
];

export default function ActivityLogsPage() {
  // TODO: Connect activity logs API
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("All activities");
  const [selected, setSelected] = React.useState<(typeof activity)[number] | null>(null);
  const visible = activity.filter((item) => type === "All activities" || item.type === type).filter((item) => `${item.name} ${item.resource}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6">
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-3xl font-semibold tracking-tight">Activity Logs</h1><p className="mt-2 text-sm text-muted-foreground">Workspace activity and important changes across your team.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline"><Filter /> Filter</Button><Button variant="outline"><CalendarDays /> Last 30 days</Button></div></header>
    <Card><CardContent className="flex flex-col gap-3 p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search activity..."/></div><select value={type} onChange={(event) => setType(event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option>All activities</option><option>Tasks</option><option>Projects</option><option>Members</option><option>Workspace</option><option>Automations</option></select><select className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option>Last 30 days</option><option>Today</option><option>Last 7 days</option><option>Custom</option></select></CardContent></Card>
    <Card><CardContent className="p-0">{visible.length ? <div className="divide-y">{visible.map((item) => <button key={item.resource} onClick={() => setSelected(item)} className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/50"><div className="relative"><Avatar name={item.name}/><span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full border-2 border-card bg-primary"/></div><div className="min-w-0 flex-1"><p className="text-sm"><span className="font-semibold">{item.name}</span> <span className="text-muted-foreground">{item.action}</span> <span className="font-medium">{item.resource}</span></p><p className="mt-1 text-sm text-muted-foreground">{item.project}</p></div><time className="shrink-0 text-xs text-muted-foreground">{item.time}</time></button>)}</div> : <div className="px-6 py-16 text-center"><p className="font-medium">No activity found</p><p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p></div>}</CardContent></Card>
    {selected && <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 p-3" role="dialog" aria-modal="true"><aside className="h-full w-full max-w-md overflow-y-auto rounded-xl border bg-card p-6 shadow-xl"><div className="flex items-start justify-between"><div><p className="text-lg font-semibold">Activity details</p><p className="mt-1 text-sm text-muted-foreground">A closer look at this workspace update.</p></div><Button size="icon" variant="ghost" onClick={() => setSelected(null)} aria-label="Close details"><X/></Button></div><div className="mt-8 space-y-5 text-sm"><div className="flex items-center gap-3"><Avatar name={selected.name}/><div><p className="font-medium">{selected.name}</p><p className="text-muted-foreground">Workspace member</p></div></div><Detail label="Action" value={selected.action}/><Detail label="Resource" value={selected.resource}/><Detail label="Related project" value={selected.project}/><Detail label="Date and time" value={selected.time}/><Detail label="Additional details" value={selected.details}/></div></aside></div>}
  </div>;
}
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 leading-6">{value}</p></div>; }
