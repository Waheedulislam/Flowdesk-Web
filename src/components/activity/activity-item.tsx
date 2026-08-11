"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { activityMeta } from "@/lib/dashboard-data";
import type { ActivityItemData } from "@/lib/dashboard-data";

export function ActivityItem({ item }: { item: ActivityItemData }) {
  const meta = activityMeta[item.type];
  const Icon = meta.icon;

  return (
    <div className="flex items-start gap-4 py-3 hover:bg-accent/40 rounded-md px-2">
      <Avatar name={item.actorName} className="size-10" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {item.actorName}
          </p>
          <p className="text-sm text-muted-foreground">{item.action}</p>
          <p className="text-sm font-semibold text-foreground">{item.target}</p>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="size-4" />
          <span>{item.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityItem;
