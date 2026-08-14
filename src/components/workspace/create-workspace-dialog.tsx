"use client";

import * as React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/context/workspace-context";

export function CreateWorkspaceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { createWorkspace } = useWorkspace();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = React.useCallback(() => {
    setName("");
    setDescription("");
    setError(null);
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  }

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (trimmedName.length < 3 || trimmedName.length > 50) {
      setError("Workspace name must be between 3 and 50 characters.");
      return;
    }
    if (trimmedDescription.length > 300) {
      setError("Description cannot exceed 300 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const workspace = await createWorkspace({
        name: trimmedName,
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
      });
      toast.success("Workspace created", { description: `${workspace.name} is now active.` });
      handleOpenChange(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn't create the workspace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-workspace-title">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">New workspace</p><h2 id="create-workspace-title" className="mt-1 text-xl font-semibold">Create a workspace</h2></div>
          <Button type="button" variant="ghost" size="icon" onClick={() => handleOpenChange(false)} disabled={isSubmitting} aria-label="Close"><X /></Button>
        </div>
        <div className="space-y-4 p-5">
          <div className="space-y-2"><Label htmlFor="new-workspace-name">Name</Label><Input id="new-workspace-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={50} required disabled={isSubmitting} /></div>
          <div className="space-y-2"><Label htmlFor="new-workspace-description">Description <span className="text-muted-foreground">(optional)</span></Label><textarea id="new-workspace-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} disabled={isSubmitting} className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm" /></div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create workspace"}</Button></div>
        </div>
      </form>
    </div>
  );
}
