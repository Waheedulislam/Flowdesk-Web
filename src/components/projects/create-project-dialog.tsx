"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: {
    name: string;
    description: string;
    status: string;
    startDate: string;
    dueDate: string;
  }) => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateProjectDialogProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState("ON_TRACK");
  const [startDate, setStartDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError(true);
      setMessage("Project name and description are required.");
      return;
    }

    setLoading(true);
    setError(false);
    setMessage(null);
    // TODO: Connect create-project API.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setLoading(false);
    onCreate({ name, description, status, startDate, dueDate });
    setMessage("Project created successfully.");
    setError(false);
    setName("");
    setDescription("");
    setStatus("ON_TRACK");
    setStartDate("");
    setDueDate("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="w-full max-w-2xl border-border/70 shadow-2xl">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add a new initiative for the team.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="project-name">Project name</Label>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="project-description">Description</Label>
                <textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <select
                  id="project-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="ON_TRACK">On track</option>
                  <option value="AT_RISK">At risk</option>
                  <option value="DELAYED">Delayed</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-color">Project color</Label>
                <Input id="project-color" defaultValue="Indigo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-start">Start date</Label>
                <Input
                  id="project-start"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-due">Due date</Label>
                <Input
                  id="project-due"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
            </div>

            {message ? (
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${error ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-success/20 bg-success/10 text-success"}`}
              >
                {error ? (
                  <AlertCircle className="size-4" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {message}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create project"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
