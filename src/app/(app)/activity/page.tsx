"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityPage() {
  // TODO: Replace with activity-logs API and Socket.IO for live updates
  const [q, setQ] = React.useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activity</h1>
          <p className="text-sm text-muted-foreground">
            Workspace activity feed and timeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Activity</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search activity…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button variant="ghost">User</Button>
            <Button variant="ghost">Type</Button>
            <Button variant="ghost">Project</Button>
            <Button variant="ghost">Date</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ActivityTimeline />
        </CardContent>
      </Card>
    </div>
  );
}
