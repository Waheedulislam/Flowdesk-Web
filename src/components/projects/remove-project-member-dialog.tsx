"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectMemberRecord } from "@/lib/api/project.api";

interface RemoveProjectMemberDialogProps {
  member: ProjectMemberRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
}

export function RemoveProjectMemberDialog({
  member,
  open,
  onOpenChange,
  onSubmit,
}: RemoveProjectMemberDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!open || !member) return null;

  const close = () => {
    setError(null);
    onOpenChange(false);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSubmit();
      close();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to remove project member.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
                Remove {member.user.name} from this project?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This removes project access only. Their workspace membership
                will not be affected.
              </p>
            </div>
          </div>
          {error ? (
            <p className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={close} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void submit()}
              disabled={loading}
            >
              {loading ? "Removing..." : "Remove member"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
