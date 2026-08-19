"use client";

import * as React from "react";
import { Loader2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { WorkspaceInvitation } from "@/lib/api/workspace.api";

interface CancelInvitationDialogProps {
  invitation: WorkspaceInvitation | null;
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (invitationId: string) => void;
}

export function CancelInvitationDialog({
  invitation,
  workspaceId,
  open,
  onOpenChange,
  onSuccess,
}: CancelInvitationDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!open || !invitation) {
    return null;
  }

  const handleCancel = async () => {
    if (!workspaceId || !invitation.id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO:
      // এখানে cancelInvitation API function call হবে।

      // আপাতত dialog close করার জন্য:
      onSuccess(invitation.id);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to cancel invitation.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="w-full max-w-md border-border/70 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>

            <div>
              <CardTitle>Cancel invitation?</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
            <p className="text-sm text-muted-foreground">
              You are about to cancel the invitation sent to:
            </p>

            <p className="mt-1 font-medium">{invitation.email}</p>
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Keep invitation
            </Button>

            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel invitation"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
