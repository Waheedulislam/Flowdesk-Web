"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TaskDistributionData = {
  TODO: number;
  IN_PROGRESS: number;
  IN_REVIEW: number;
  DONE: number;
  OVERDUE: number;
};

export function TaskDistributionChart({
  data,
}: {
  data: TaskDistributionData | null;
}) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
          No task analytics available for this workspace.
        </CardContent>
      </Card>
    );
  }

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1">
            {Object.entries(data).map(([k, v]) => (
              <div key={k} className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="capitalize text-foreground">
                    {k.replace("_", " ")}
                  </div>
                  <div className="font-medium text-foreground">{v}</div>
                </div>
                <div className="h-2 w-full rounded bg-muted/30 mt-1">
                  <div
                    className={cn("h-2 rounded", {
                      "bg-destructive": k === "OVERDUE",
                      "bg-success": k === "DONE",
                      "bg-primary": k === "IN_PROGRESS",
                      "bg-info": k === "IN_REVIEW",
                      "bg-muted": k === "TODO",
                    })}
                    style={{ width: total ? `${(v / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskDistributionChart;
