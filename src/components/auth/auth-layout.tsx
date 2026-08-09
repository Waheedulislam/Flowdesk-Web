import Link from "next/link";
import { BarChart3, Sparkles, Workflow } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/**
 * Two-column authentication layout.
 *
 * Left: the form column (the only column on mobile), centered with a brand
 * header and the theme toggle. Right (lg+): a brand panel that carries the
 * FlowDesk identity — the "flow" motif repeated as layered rules — so the
 * auth screens feel like part of the product, not a bare form.
 *
 * Pages pass their form as children and set the heading/subheading copy.
 */
export function AuthLayout({
  children,
  heading,
  subheading,
}: {
  children: React.ReactNode;
  heading: string;
  subheading?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh w-full bg-background">
      {/* Form column */}
      <div className="flex w-full flex-col lg:w-[52%] xl:w-[46%]">
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="FlowDesk home"
          >
            <BrandMark />
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-7 flex flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {heading}
              </h1>
              {subheading ? (
                <p className="text-sm text-muted-foreground">{subheading}</p>
              ) : null}
            </div>
            {children}
          </div>
        </main>

        <footer className="px-6 py-5 text-center text-xs text-muted-foreground sm:px-10">
          © {new Date().getFullYear()} FlowDesk. All rights reserved.
        </footer>
      </div>

      {/* Brand panel — decorative, hidden on small screens */}
      <AuthBrandPanel />
    </div>
  );
}

function AuthBrandPanel() {
  const highlights = [
    {
      icon: Workflow,
      title: "Plan and ship in one place",
      body: "Projects, tasks, and boards that stay in sync with your team.",
    },
    {
      icon: BarChart3,
      title: "See the whole picture",
      body: "Live analytics on progress, workload, and momentum.",
    },
    {
      icon: Sparkles,
      title: "Automate the busywork",
      body: "Let AI and workflows handle the repetitive steps for you.",
    },
  ];

  return (
    <aside
      aria-hidden
      className="relative hidden overflow-hidden bg-sidebar lg:flex lg:w-[48%] lg:flex-col xl:w-[54%]"
    >
      {/* Layered "flow" rules echoing the brand mark */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <svg
          className="absolute -right-24 top-1/2 h-[140%] w-[140%] -translate-y-1/2 text-primary"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <path
              key={i}
              d={`M-20 ${40 + i * 26} H${180 + (i % 3) * 90}`}
            />
          ))}
        </svg>
      </div>
      <div
        className="pointer-events-none absolute -left-16 top-[-10%] size-[420px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
          opacity: 0.14,
        }}
      />

      <div className="relative flex flex-1 flex-col justify-center gap-10 px-12 py-16 xl:px-20">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sidebar-border bg-card/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            The workspace for modern teams
          </span>
          <p className="max-w-md text-2xl font-semibold leading-snug tracking-tight text-sidebar-foreground xl:text-3xl">
            Where your team&apos;s work finds its flow.
          </p>
        </div>

        <ul className="flex flex-col gap-5">
          {highlights.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Icon className="size-4" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {title}
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
