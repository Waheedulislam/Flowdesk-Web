"use client";

import * as React from "react";
import { Paperclip, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChatInput({ onSend, loading }: { onSend: (message: string) => void; loading: boolean }) {
  const [value, setValue] = React.useState("");
  const [attachment, setAttachment] = React.useState<File | null>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);
  const send = () => { const message = value.trim(); if (!message || loading) return; onSend(message); setValue(""); setAttachment(null); };
  return <div className="border-t bg-card px-4 py-4 sm:px-7"><div className="mx-auto max-w-3xl"><div className="rounded-xl border bg-background p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">{attachment && <div className="mb-2 flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2 text-sm"><div className="min-w-0"><p className="truncate font-medium">{attachment.name}</p><p className="text-xs text-muted-foreground">{(attachment.size / 1024 / 1024).toFixed(1)} MB</p></div><Button size="icon" variant="ghost" className="size-7" aria-label="Remove attachment" onClick={() => setAttachment(null)}><X /></Button></div>}<textarea value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Ask FlowDesk AI..." rows={1} className="max-h-36 min-h-12 w-full resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" /><div className="flex items-center justify-between gap-3 px-1"><div className="flex items-center gap-2"><input ref={fileInput} type="file" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} /><Button size="icon" variant="ghost" aria-label="Attach file" onClick={() => fileInput.current?.click()}><Paperclip /></Button><span className="hidden text-xs text-muted-foreground sm:inline">Enter to send · Shift + Enter for new line</span></div><Button size="icon" aria-label="Send message" disabled={!value.trim() || loading} onClick={send}><Send /></Button></div></div><p className="mt-2 text-center text-xs text-muted-foreground">FlowDesk AI uses workspace context to help you work faster.</p></div></div>;
}
