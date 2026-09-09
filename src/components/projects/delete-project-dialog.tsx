"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DeleteProjectDialog({
  open,
  onOpenChange,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
}) {
  const [loading, setLoading] = React.useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-3 backdrop-blur-sm">
      <Card className="w-full max-w-md border-destructive/20 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertTriangle className="size-5 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Delete project?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await onDelete();
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
