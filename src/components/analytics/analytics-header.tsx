"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";

export function AnalyticsHeader() {
  return (
    <Card className="mb-4">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Analytics</CardTitle>
          <p className="text-sm text-muted-foreground">
            Workspace performance, task completion, project health, and team
            productivity at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select className="rounded-md border px-3 py-2 text-sm">
            <option>FlowDesk Core</option>
            <option>Growth Team</option>
          </select>

          <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <Calendar className="size-4" /> This week
          </button>

          <Button variant="ghost" size="sm">
            Refresh
          </Button>
          <Button variant="default" size="sm">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0" />
    </Card>
  );
}

export default AnalyticsHeader;
