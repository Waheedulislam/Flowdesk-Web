import { Bot, ChevronDown, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function AiHeader({ onOpenConversations }: { onOpenConversations: () => void }) {
  return <header className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex items-start gap-3"><button type="button" onClick={onOpenConversations} aria-label="Open conversations" className="mt-0.5 rounded-md border p-2 text-muted-foreground hover:bg-accent lg:hidden"><Bot className="size-4" /></button><div><div className="flex items-center gap-2"><h1 className="text-xl font-semibold tracking-tight">AI Assistant</h1><Badge variant="success" className="h-6 px-2"><span className="size-1.5 rounded-full bg-success" />Ready</Badge></div><p className="mt-1 text-sm text-muted-foreground">Your workspace copilot for tasks, projects, productivity, and workflow automation.</p></div></div><button type="button" className="inline-flex w-fit items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"><Sparkles className="size-4 text-primary" />FlowDesk Core <ChevronDown className="size-4 text-muted-foreground" /></button></header>;
}
