"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectItem } from "@/lib/projects-data";

interface ProjectSettingsProps {
  project: ProjectItem;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const [name, setName] = React.useState(project.name);
  const [description, setDescription] = React.useState(project.description);
  const [visibility, setVisibility] = React.useState(project.visibility);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    // TODO: Connect update-project API.
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setLoading(false);
    setMessage("Project settings updated.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="settings-name">Project name</Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-description">Description</Label>
            <textarea
              id="settings-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-visibility">Visibility</Label>
            <select
              id="settings-visibility"
              value={visibility}
              onChange={(event) =>
                setVisibility(event.target.value as ProjectItem["visibility"])
              }
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="Private">Private</option>
              <option value="Team">Team</option>
              <option value="Public">Public</option>
            </select>
          </div>
          {message ? <p className="text-sm text-success">{message}</p> : null}
          <div className="flex flex-wrap gap-2">
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
            <Button variant="outline">Cancel</Button>
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
              <p className="font-medium">Archive project</p>
              <p className="text-sm text-muted-foreground">
                This will keep the project in view but remove it from active
                workstreams.
              </p>
            </div>
            <Button variant="destructive">Archive</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
