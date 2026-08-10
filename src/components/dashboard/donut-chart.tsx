import type { Tone } from "@/lib/dashboard-data";

/**
 * Dependency-free donut chart drawn with SVG stroke arcs.
 * No chart library is installed, so segments are rendered as overlapping
 * circles using stroke-dasharray. Colors come from the theme tokens, so the
 * chart tracks light/dark mode automatically.
 */

/** Raw design tokens (defined in globals.css :root/.dark) used for stroke. */
const toneVar: Record<Tone, string> = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  info: "var(--info)",
  destructive: "var(--destructive)",
  muted: "var(--muted-foreground)",
};

export interface DonutSegment {
  key: string;
  value: number;
  tone: Tone;
}

interface DonutChartProps {
  segments: DonutSegment[];
  /** Large number rendered in the middle. */
  centerValue: string;
  /** Caption under the center value. */
  centerLabel: string;
  size?: number;
  strokeWidth?: number;
}

function DonutChart({
  segments,
  centerValue,
  centerLabel,
  size = 176,
  strokeWidth = 16,
}: DonutChartProps) {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let accrued = 0;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Task distribution donut chart, ${centerValue} ${centerLabel}`}
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {segments.map((segment) => {
          const fraction = segment.value / total;
          const dash = fraction * circumference;
          const offset = -(accrued / total) * circumference;
          accrued += segment.value;

          return (
            <circle
              key={segment.key}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={toneVar[segment.tone]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums text-foreground">
          {centerValue}
        </span>
        <span className="text-xs text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  );
}

export { DonutChart };
