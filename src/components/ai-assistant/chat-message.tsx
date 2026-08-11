"use client";

import * as React from "react";
import { Bot, Copy, RefreshCw, ThumbsDown, ThumbsUp, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ChatMessage as ChatMessageType } from "@/lib/ai-assistant-data";

export function ChatMessage({ message, onRegenerate }: { message: ChatMessageType; onRegenerate: () => void }) {
  const [rating, setRating] = React.useState<"up" | "down" | null>(null);
  const copy = async () => { try { await navigator.clipboard.writeText(message.content); toast.success("Message copied"); } catch { toast.error("Unable to copy message"); } };
  if (message.role === "user") return <div className="flex justify-end gap-3"><div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground sm:max-w-[72%]"><p className="whitespace-pre-wrap break-words">{message.content}</p><time className="mt-1 block text-right text-[11px] text-primary-foreground/70">{message.timestamp}</time></div><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted"><UserRound className="size-4" /></div></div>;
  return <div className="flex gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Bot className="size-4" /></div><div className="min-w-0 max-w-[85%] sm:max-w-[72%]"><div className="rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-sm leading-6 shadow-sm"><p className="whitespace-pre-wrap break-words">{message.content}</p><time className="mt-1.5 block text-[11px] text-muted-foreground">{message.timestamp}</time></div><div className="mt-1 flex items-center gap-0.5 text-muted-foreground"><Button size="icon" variant="ghost" className="size-7" aria-label="Copy response" onClick={copy}><Copy /></Button><Button size="icon" variant="ghost" className="size-7" aria-label="Regenerate response" onClick={onRegenerate}><RefreshCw /></Button><Button size="icon" variant="ghost" className={`size-7 ${rating === "up" ? "text-primary" : ""}`} aria-label="Like response" onClick={() => setRating("up")}><ThumbsUp /></Button><Button size="icon" variant="ghost" className={`size-7 ${rating === "down" ? "text-destructive" : ""}`} aria-label="Dislike response" onClick={() => setRating("down")}><ThumbsDown /></Button></div></div></div>;
}

export function TypingIndicator() { return <div className="flex gap-3"><div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Bot className="size-4" /></div><div className="rounded-2xl rounded-tl-md border bg-card px-4 py-3 shadow-sm"><div className="flex items-center gap-2 text-sm text-muted-foreground"><span>AI is thinking</span><span className="flex gap-1"><i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" /><i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" /><i className="size-1.5 animate-bounce rounded-full bg-primary" /></span></div></div></div>; }
