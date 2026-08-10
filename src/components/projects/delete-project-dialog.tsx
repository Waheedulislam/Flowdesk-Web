"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    // TODO: Connect delete-project API.
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setLoading(false);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="w-full max-w-md border-destructive/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-destructive/10 p-2 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Delete project?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This action permanently removes the project and its shared
                context. It cannot be undone.
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
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete project"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
