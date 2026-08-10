"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { WorkspaceMember } from "@/lib/workspace-data";

interface RemoveMemberDialogProps {
  member: WorkspaceMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RemoveMemberDialog({
  member,
  open,
  onOpenChange,
  onConfirm,
}: RemoveMemberDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const handleRemove = async () => {
    if (!member) return;
    setLoading(true);
    // TODO: Connect remove member API.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setLoading(false);
    onConfirm();
    onOpenChange(false);
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
              <h3 className="text-lg font-semibold">Remove {member.name}?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This will revoke their access to the workspace. You can
                re-invite them later if needed.
              </p>
            </div>
          </div>

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
