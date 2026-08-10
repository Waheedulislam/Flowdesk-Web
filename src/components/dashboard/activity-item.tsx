import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { activityMeta, type ActivityItemData } from "@/lib/dashboard-data";
import { toneChip } from "./tone-styles";

/**
 * A single activity row: actor avatar, a sentence describing the action, a
 * type icon badge, and a relative timestamp. Presentational only.
 */

interface ActivityItemProps {
  activity: ActivityItemData;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const meta = activityMeta[activity.type];
  const Icon = meta.icon;

  return (
    <li className="flex items-start gap-3">
      <div className="relative shrink-0">
        <Avatar name={activity.actorName} src={activity.actorAvatarUrl} className="size-9" />
        <span
          className={cn(
            "absolute -bottom-1 -right-1 inline-flex size-5 items-center justify-center rounded-full ring-2 ring-card",
            toneChip[meta.tone],
          )}
        >
          <Icon className="size-3" aria-hidden />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-foreground">
          <span className="font-medium">{activity.actorName}</span>{" "}
          <span className="text-muted-foreground">{activity.action}</span>{" "}
          <span className="font-medium">{activity.target}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{activity.timestamp}</p>
      </div>
    </li>
  );
}

export { ActivityItem };
