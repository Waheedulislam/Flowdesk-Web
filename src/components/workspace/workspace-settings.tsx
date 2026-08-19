"use client";

import * as React from "react";
import { AlertTriangle, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { WorkspaceOverviewModel } from "@/components/workspace/workspace-overview";

import { useAuth } from "@/context/auth-context";
import { leaveWorkspace } from "@/lib/api/workspace.api";

interface WorkspaceSettingsProps {
  workspace: WorkspaceOverviewModel;
  workspaceId: string;
  userRole: string;
  onWorkspaceLeft: () => void | Promise<void>;
}

export function WorkspaceSettings({
  workspace,
  workspaceId,
  userRole,
  onWorkspaceLeft,
}: WorkspaceSettingsProps) {
  const { accessToken } = useAuth();

  const [name, setName] = React.useState(workspace.name);
  const [description, setDescription] = React.useState(workspace.description);
  const [status, setStatus] = React.useState(workspace.status);

  const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);

  const handleLeaveWorkspace = async () => {
    if (!accessToken || !workspaceId) {
      toast.error("Unable to leave workspace", {
        description: "Authentication or workspace information is missing.",
      });

      return;
    }

    setLeaving(true);

    try {
      await leaveWorkspace(accessToken, workspaceId);

      toast.success("Workspace left successfully", {
        description: `You have left "${workspace.name}".`,
      });

      setLeaveDialogOpen(false);

      onWorkspaceLeft();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to leave workspace.";

      toast.error("Failed to leave workspace", {
        description: message,
      });
    } finally {
      setLeaving(false);
    }
  };

  return (
    <>
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
              <Label htmlFor="workspace-description">
                Workspace description
              </Label>

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
              Workspace updates are unavailable until the backend provides an
              update endpoint.
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" disabled>
                Cancel
              </Button>

              <Button disabled>Save changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* DANGER ZONE */}

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-4" />
              Danger zone
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* LEAVE WORKSPACE */}

            {userRole !== "OWNER" ? (
              <div className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">Leave workspace</p>

                  <p className="text-sm text-muted-foreground">
                    Leave this workspace and lose access to its projects, tasks,
                    and team activity.
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={() => setLeaveDialogOpen(true)}
                >
                  Leave workspace
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border/70 bg-muted/40 p-4">
                <p className="font-medium">Workspace owner</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  The workspace owner cannot leave the workspace. Transfer
                  ownership first if this functionality is needed.
                </p>
              </div>
            )}

            {/* ARCHIVE */}

            {userRole === "OWNER" ? (
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
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* LEAVE CONFIRMATION */}

      {leaveDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
          <Card className="w-full max-w-md border-destructive/20 shadow-2xl">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="size-5 text-destructive" />
                </div>

                <div>
                  <CardTitle>Leave workspace?</CardTitle>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This action will remove your access to this workspace.
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
                <p className="text-sm text-muted-foreground">
                  You are about to leave:
                </p>

                <p className="mt-1 font-medium">{workspace.name}</p>
              </div>

              <p className="text-sm text-muted-foreground">
                You will no longer be able to access this workspace, its
                projects, tasks, and team activity unless you are invited again.
              </p>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setLeaveDialogOpen(false)}
                  disabled={leaving}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleLeaveWorkspace}
                  disabled={leaving}
                >
                  {leaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Leaving...
                    </>
                  ) : (
                    "Leave workspace"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
