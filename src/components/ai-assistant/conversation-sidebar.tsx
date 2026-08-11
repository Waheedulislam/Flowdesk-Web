"use client";

import { MessageSquarePlus, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Conversation } from "@/lib/ai-assistant-data";
import { cn } from "@/lib/utils";

export function ConversationSidebar({ conversations, selectedId, search, onSearch, onSelect, onNew, mobile = false }: { conversations: Conversation[]; selectedId: string | null; search: string; onSearch: (value: string) => void; onSelect: (id: string) => void; onNew: () => void; mobile?: boolean }) {
  const visible = conversations.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  return <aside className={cn("flex h-full w-full flex-col bg-card", !mobile && "border-r") }><div className="space-y-3 border-b p-4"><Button className="w-full justify-start" onClick={onNew}><MessageSquarePlus />New conversation</Button><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search conversations" className="pl-9" /></div></div><div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-thin">{(["Today", "Yesterday"] as const).map((group) => { const items = visible.filter((item) => item.group === group); return items.length ? <section key={group} className="mb-5"><p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</p><div className="space-y-1">{items.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={cn("group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors", selectedId === item.id ? "bg-primary/10 text-primary" : "hover:bg-accent")}><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-foreground">{item.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{item.timestamp}</span></span><MoreHorizontal className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></button>)}</div></section> : null; })}{!visible.length && <p className="px-2 py-8 text-center text-sm text-muted-foreground">No conversations found.</p>}</div></aside>;
}
