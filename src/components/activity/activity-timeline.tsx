"use client";

import * as React from "react";
import { recentActivity } from "@/lib/dashboard-data";
import { ActivityItem } from "./activity-item";

export function ActivityTimeline() {
  const items = recentActivity;
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <ActivityItem key={it.id} item={it} />
      ))}
    </div>
  );
}

export default ActivityTimeline;
