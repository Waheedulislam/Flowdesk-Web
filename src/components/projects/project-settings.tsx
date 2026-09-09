"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  ProjectRecord,
  UpdateProjectPayload,
} from "@/lib/api/project.api";

export function ProjectSettings({
  project,
  onUpdate,
  onArchive,
  onDelete,
}: {
  project: ProjectRecord;
  onUpdate: (payload: UpdateProjectPayload) => Promise<void>;
  onArchive: () => Promise<void>;
  onDelete: () => void;
}) {
  const [name, setName] = React.useState(project.name);
  const [description, setDescription] = React.useState(
    project.description ?? "",
  );
  const [status, setStatus] = React.useState(project.status);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const save = async () => {
    setLoading(true);
    setError(null);
    try {
      await onUpdate({
        name: name.trim(),
        description: description.trim() || undefined,
        status,
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to update project.";
      setError(message);
      toast.error("Unable to update project", { description: message });
    } finally {
      setLoading(false);
    }
  };

  const archive = async () => {
    setLoading(true);
    setError(null);
    try {
      await onArchive();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to archive project.";
      setError(message);
      toast.error("Unable to archive project", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="grid gap-2 text-sm font-medium">
            Project name
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Status
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as typeof status)
              }
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {[
                "PLANNING",
                "ACTIVE",
                "IN_PROGRESS",
                "ON_HOLD",
                "COMPLETED",
                "ARCHIVED",
              ].map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          {error ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button
            onClick={() => void save()}
            disabled={loading || !name.trim()}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Save changes
          </Button>
        </CardContent>
      </Card>
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" />
            Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => void archive()}
            disabled={loading}
          >
            Archive project
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            Delete project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
