"use client";

import * as React from "react";
import { AlertTriangle, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkspaceOverviewModel } from "@/components/workspace/workspace-overview";

interface WorkspaceSettingsProps {
  workspace: WorkspaceOverviewModel;
}

export function WorkspaceSettings({ workspace }: WorkspaceSettingsProps) {
  const [name, setName] = React.useState(workspace.name);
  const [description, setDescription] = React.useState(workspace.description);
  const [status, setStatus] = React.useState(workspace.status);

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

          <div className="rounded-lg border border-info/30 bg-info/10 px-3 py-2 text-sm text-info">
            Workspace updates are unavailable until the backend provides an update endpoint.
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" disabled>Cancel</Button>
            <Button disabled>Save changes</Button>
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
