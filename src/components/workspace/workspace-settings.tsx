"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkspaceOverview } from "@/components/workspace/workspace-page";

interface WorkspaceSettingsProps {
  workspace: WorkspaceOverview;
}

export function WorkspaceSettings({ workspace }: WorkspaceSettingsProps) {
  const [name, setName] = React.useState(workspace.name);
  const [description, setDescription] = React.useState(workspace.description);
  const [status, setStatus] = React.useState(workspace.status);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [hasError, setHasError] = React.useState(false);

  const handleSave = async () => {
    setLoading(true);
    setHasError(false);
    setMessage(null);

    // TODO: Connect workspace update API.
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setLoading(false);
    setMessage("Workspace updated successfully.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Workspace settings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Adjust the workspace identity and availability.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input
                id="workspace-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-status">Workspace status</Label>
              <Input
                id="workspace-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workspace-description">Workspace description</Label>
            <textarea
              id="workspace-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>Workspace logo</Label>
            <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Upload a workspace logo</p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, or SVG up to 5MB.
                </p>
              </div>
              <Button variant="outline" className="w-fit">
                <Upload className="size-4" />
                Upload
              </Button>
            </div>
          </div>

          {message ? (
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${hasError ? "border-destructive/20 bg-destructive/10 text-destructive" : "border-success/20 bg-success/10 text-success"}`}
            >
              {hasError ? (
                <AlertTriangle className="size-4" />
              ) : (
                <CheckCircle2 className="size-4" />
              )}
              {message}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-4" />
            Danger zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">Archive workspace</p>
              <p className="text-sm text-muted-foreground">
                This action pauses access and archives the workspace for the
                team.
              </p>
            </div>
            <Button variant="destructive">Archive</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
