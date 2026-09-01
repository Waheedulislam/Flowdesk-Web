"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TaskTrendChart({ data }: { data?: number[] }) {
  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Completion Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
          Completion trend data is not available from the workspace analytics
          API.
        </CardContent>
      </Card>
    );
  }

  const max = Math.max(...data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${data.length} ${max}`}
          className="w-full h-40"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
            points={data
              .map(
                (v, i) =>
                  `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`,
              )
              .join(" ")}
            className="text-primary/80"
          />
          {data.map((v, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 100}
              cy={100 - (v / max) * 100}
              r={1}
              className="text-primary"
            />
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}

export default TaskTrendChart;
