"use client";

import { Activity, BarChart3, CheckCircle2, FolderKanban, ListChecks, Users } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useRole, type UserRole } from "@/context/role-context";
import { RoleBadge } from "@/components/roles/role-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data: Record<UserRole, {
  copy: string;
  stats: [string, string, typeof FolderKanban][];
  sections: string[];
}> = {
  SYSTEM_ADMIN: {
    copy: "Platform overview and system health.",
    stats: [["Total Workspaces", "128", FolderKanban], ["Total Users", "2,486", Users], ["Active Projects", "342", BarChart3], ["Tasks Completed", "18,420", CheckCircle2]],
    sections: ["Platform Growth", "User Activity", "Workspace Distribution", "Recent System Activity"],
  },
  ADMIN: {
    copy: "Here’s an overview of your workspace and team momentum.",
    stats: [["Active Projects", "12", FolderKanban], ["Team Members", "24", Users], ["Tasks in Progress", "38", ListChecks], ["Completion Rate", "82%", CheckCircle2]],
    sections: ["Team workload", "Project progress", "Recent activity", "Notifications"],
  },
  USER: {
    copy: "Here’s what needs your attention today.",
    stats: [["Due Today", "4", ListChecks], ["In Progress", "7", Activity], ["Completed", "18", CheckCircle2], ["Overdue", "2", BarChart3]],
    sections: ["My Tasks", "My Projects", "Recent Activity", "Notifications"],
  },
};

export function RoleDashboard() {
  const { user } = useAuth();
  const { role } = useRole();

  if (!user || !role) {
    return <p className="text-sm text-muted-foreground">Loading your dashboard…</p>;
  }

  const content = data[role];
  return <div className="flex flex-col gap-6"><header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p><RoleBadge role={role} /></div><h1 className="mt-1 text-3xl font-semibold tracking-tight">Good to see you, {user.name}</h1><p className="mt-2 text-sm text-muted-foreground">{content.copy}</p></div></header><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{content.stats.map(([label, value, Icon]) => <Card key={label}><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><Icon className="size-4 text-primary" /></div><p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-success">Updated today</p></CardContent></Card>)}</div><div className="grid gap-4 lg:grid-cols-2">{content.sections.map((title, index) => <Card key={title} className={index === 0 ? "lg:col-span-2" : ""}><CardHeader className="pb-3"><CardTitle>{title}</CardTitle></CardHeader><CardContent>{index === 0 ? <div className="grid gap-3 sm:grid-cols-3">{["On track", "Needs attention", "Completed"].map((label, item) => <div key={label} className="rounded-lg bg-muted/60 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{[18, 6, 42][item]}</p></div>)}</div> : <div className="space-y-3">{["Workspace activity updated", "Project review completed", "New task assignment"].map((text) => <div key={text} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0"><span className="size-2 rounded-full bg-primary" /><span className="text-sm">{text}</span><span className="ml-auto text-xs text-muted-foreground">Today</span></div>)}</div>}</CardContent></Card>)}</div></div>;
}
