"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  removeMember,
  type WorkspaceMemberRecord,
} from "@/lib/api/workspace.api";

import { useAuth } from "@/context/auth-context";

interface RemoveMemberDialogProps {
  member: WorkspaceMemberRecord | null;
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (memberId: string) => void;
}

export function RemoveMemberDialog({
  member,
  workspaceId,
  open,
  onOpenChange,
  onSuccess,
}: RemoveMemberDialogProps) {
  const { accessToken } = useAuth();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRemove = async () => {
    if (!member || !accessToken || !workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      await removeMember(accessToken, workspaceId, member.id);

      // Remove from frontend immediately
      onSuccess(member.id);

      onOpenChange(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove member.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="w-full max-w-md border-destructive/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-destructive/10 p-2 text-destructive">
              <AlertTriangle className="size-5" />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Remove {member.user.name}?
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                This will revoke their access to the workspace. You can
                re-invite them later if needed.
              </p>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove member"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
