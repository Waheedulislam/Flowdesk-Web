"use client";

import * as React from "react";
import { Bot, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AiCapabilities } from "@/components/ai-assistant/ai-capabilities";
import { AiHeader } from "@/components/ai-assistant/ai-header";
import { ChatInput } from "@/components/ai-assistant/chat-input";
import { ChatMessage, TypingIndicator } from "@/components/ai-assistant/chat-message";
import { ConversationSidebar } from "@/components/ai-assistant/conversation-sidebar";
import { getMockResponse, mockConversations, suggestedPrompts, type ChatMessage as ChatMessageType, type Conversation } from "@/lib/ai-assistant-data";

const now = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function AiAssistantPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>(mockConversations);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = conversations.find((item) => item.id === selectedId) ?? null;

  React.useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
  const select = (id: string) => { setSelectedId(id); setDrawerOpen(false); };
  const newConversation = () => { setSelectedId(null); setDrawerOpen(false); setLoading(false); };
  const send = (content: string) => {
    // TODO: Connect AI chat API
    // TODO: Connect AI streaming response
    const id = selectedId ?? crypto.randomUUID();
    const userMessage: ChatMessageType = { id: crypto.randomUUID(), role: "user", content, timestamp: now() };
    if (!selectedId) { setSelectedId(id); setConversations((current) => [{ id, title: content.slice(0, 38) || "New conversation", timestamp: "Just now", group: "Today", messages: [userMessage] }, ...current]); }
    else setConversations((current) => current.map((item) => item.id === id ? { ...item, timestamp: "Just now", messages: [...item.messages, userMessage] } : item));
    setLoading(true);
    timeout.current = setTimeout(() => { const reply: ChatMessageType = { id: crypto.randomUUID(), role: "assistant", content: getMockResponse(content), timestamp: now() }; setConversations((current) => current.map((item) => item.id === id ? { ...item, messages: [...item.messages, reply] } : item)); setLoading(false); }, 750);
  };
  const regenerate = () => { if (!selected || loading) return; setLoading(true); timeout.current = setTimeout(() => { setConversations((current) => current.map((item) => item.id === selected.id ? { ...item, messages: [...item.messages, { id: crypto.randomUUID(), role: "assistant", content: getMockResponse(item.messages.at(-1)?.content ?? ""), timestamp: now() }] } : item)); setLoading(false); }, 650); };
  const sidebar = <ConversationSidebar conversations={conversations} selectedId={selectedId} search={search} onSearch={setSearch} onSelect={select} onNew={newConversation} />;
  return <><div className="flex min-h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-card shadow-sm"><div className="hidden w-80 shrink-0 lg:block">{sidebar}</div><div className="flex min-w-0 flex-1 flex-col"><AiHeader onOpenConversations={() => setDrawerOpen(true)} /><main className="min-h-0 flex-1 overflow-y-auto bg-muted/20 px-4 py-6 sm:px-7">{selected ? <div className="mx-auto max-w-3xl space-y-5">{selected.messages.map((message) => <ChatMessage key={message.id} message={message} onRegenerate={regenerate} />)}{loading && <TypingIndicator />}</div> : <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center py-6"><div className="text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Bot className="size-6" /></div><h2 className="mt-4 text-2xl font-semibold tracking-tight">How can I help with your workspace?</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Ask about tasks, project health, team productivity, or ways to automate repetitive work.</p></div><div className="mt-8 grid gap-2 sm:grid-cols-2">{suggestedPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => send(prompt)} className="rounded-lg border bg-card px-4 py-3 text-left text-sm shadow-sm transition-colors hover:border-primary/30 hover:bg-accent"><Sparkles className="mb-2 size-4 text-primary" />{prompt}</button>)}</div><div className="mt-8"><p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">FlowDesk AI can help with</p><AiCapabilities /></div></div>}</main><ChatInput onSend={send} loading={loading} /></div></div>{drawerOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close conversations" onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" /><div className="relative h-full w-[min(20rem,85vw)] shadow-xl"><div className="absolute right-2 top-2 z-10"><Button size="icon" variant="ghost" aria-label="Close conversations" onClick={() => setDrawerOpen(false)}><X /></Button></div>{sidebar}</div></div>}</>;
}
