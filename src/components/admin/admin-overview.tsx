import Link from "next/link";
import { ArrowRight, BarChart3, Building2, ShieldCheck, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  { label: "Total users", value: "2,486", icon: Users },
  { label: "Active workspaces", value: "96", icon: Building2 },
  { label: "Tasks completed", value: "18,420", icon: ShieldCheck },
];

/** UI-only platform overview for the mock super-admin role. */
export function AdminOverview() {
  // TODO: Connect admin overview API
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Administration</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">A concise platform overview for workspace administration.</p>
        </div>
        <Link href="/admin/analytics" className={buttonVariants({ variant: "outline" })}><BarChart3 />View system analytics</Link>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => <Card key={label} className="transition-shadow hover:shadow-md"><CardContent className="p-5"><Icon className="size-5 text-primary"/><p className="mt-4 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p></CardContent></Card>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Administration shortcuts</CardTitle><CardDescription>Review the areas that need your attention.</CardDescription></CardHeader><CardContent className="space-y-2">{[["Users", "/admin/users"], ["Workspaces", "/admin/workspaces"], ["Audit logs", "/admin/audit-logs"]].map(([label, href]) => <Link key={href} href={href} className="flex items-center justify-between rounded-md border px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"><span>{label}</span><ArrowRight className="size-4 text-muted-foreground"/></Link>)}</CardContent></Card>
        <Card><CardHeader><CardTitle>Platform activity</CardTitle><CardDescription>Mock activity from the last 24 hours.</CardDescription></CardHeader><CardContent className="space-y-4 text-sm">{["18 new users joined FlowDesk", "4 workspaces upgraded their plan", "126 tasks were completed"].map((item, index) => <div key={item} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"><span>{item}</span><span className="shrink-0 text-xs text-muted-foreground">{index + 1}h ago</span></div>)}</CardContent></Card>
      </div>
    </div>
  );
}
