import { BarChart3, ClipboardCheck, Lightbulb, ListTodo, Workflow } from "lucide-react";

const capabilities = [{ label: "Task insights", icon: ListTodo }, { label: "Project summaries", icon: ClipboardCheck }, { label: "Team productivity", icon: BarChart3 }, { label: "Workflow suggestions", icon: Workflow }, { label: "Recommendations", icon: Lightbulb }];

export function AiCapabilities() { return <div className="mx-auto grid max-w-3xl gap-2 sm:grid-cols-2 lg:grid-cols-3">{capabilities.map(({ label, icon: Icon }) => <div key={label} className="flex items-center gap-2 rounded-lg border bg-card/70 px-3 py-2 text-sm text-muted-foreground"><Icon className="size-4 text-primary" />{label}</div>)}</div>; }
