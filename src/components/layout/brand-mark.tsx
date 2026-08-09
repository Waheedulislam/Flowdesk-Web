import { cn } from "@/lib/utils";

/**
 * FlowDesk wordmark. The glyph is a stylized "flow" — two offset bars forming
 * a forward-motion mark — set in the iris brand color. Text hides in the
 * collapsed rail while the glyph stays as a persistent anchor.
 */
export function BrandMark({
  collapsed = false,
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
        >
          <path d="M5 7h11" />
          <path d="M5 12h14" />
          <path d="M5 17h8" />
        </svg>
      </span>
      {!collapsed && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          Flow<span className="text-primary">Desk</span>
        </span>
      )}
    </span>
  );
}
