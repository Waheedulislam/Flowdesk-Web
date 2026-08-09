"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * A slide-in panel used for mobile navigation and, later, detail drawers.
 * Dependency-free: manages the backdrop, Escape-to-close, body scroll lock,
 * and focus return to the trigger. Animations are CSS transitions.
 */

type Side = "left" | "right";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: Side;
  /** Accessible title; rendered visually unless `hideTitle` is set. */
  title: string;
  description?: string;
  hideTitle?: boolean;
  className?: string;
  children: React.ReactNode;
}

function Sheet({
  open,
  onOpenChange,
  side = "left",
  title,
  description,
  hideTitle = false,
  className,
  children,
}: SheetProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();

  // Delay unmount so the exit transition can play.
  const [render, setRender] = React.useState(open);
  React.useEffect(() => {
    if (open) {
      setRender(true);
      previouslyFocused.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!render) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("keydown", onKeyDown);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = original;
    };
  }, [render, onOpenChange]);

  // Move focus into the panel when it opens; restore it on close.
  React.useEffect(() => {
    if (open && panelRef.current) {
      const focusable = panelRef.current.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      focusable?.focus();
    } else if (!open) {
      previouslyFocused.current?.focus?.();
    }
  }, [open]);

  if (!mounted || !render) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" aria-hidden={!open}>
      <div
        className={cn(
          "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={() => onOpenChange(false)}
        onTransitionEnd={() => {
          if (!open) setRender(false);
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "absolute inset-y-0 flex w-[85%] max-w-xs flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-300 ease-out",
          side === "left" ? "left-0" : "right-0",
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2 p-4">
          <div className={cn(hideTitle && "sr-only")}>
            <h2 id={titleId} className="text-sm font-semibold">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            onClick={() => onOpenChange(false)}
            className={cn(hideTitle && "ml-auto")}
          >
            <X />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Sheet };
