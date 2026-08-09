"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A small, accessible dropdown menu built without external deps.
 * Handles click-outside, Escape to close, and returns focus to the trigger.
 * Positioning is CSS-based (absolute, aligned to the trigger).
 */

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) {
    throw new Error("DropdownMenu components must be used within <DropdownMenu>");
  }
  return ctx;
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentId = React.useId();

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, contentId }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

interface TriggerProps extends React.ComponentProps<"button"> {
  asChild?: never;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ onClick, ...props }, _ref) => {
    const { open, setOpen, triggerRef, contentId } = useDropdown();
    return (
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={(e) => {
          onClick?.(e);
          setOpen(!open);
        }}
        {...props}
      />
    );
  },
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface ContentProps extends React.ComponentProps<"div"> {
  align?: "start" | "end";
  sideOffset?: number;
}

function DropdownMenuContent({
  className,
  align = "end",
  sideOffset = 8,
  children,
  ...props
}: ContentProps) {
  const { open, setOpen, triggerRef, contentId } = useDropdown();
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !contentRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="menu"
      style={{ marginTop: sideOffset }}
      className={cn(
        "absolute z-50 min-w-56 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg animate-pop-in",
        align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ItemProps extends React.ComponentProps<"button"> {
  inset?: boolean;
  variant?: "default" | "destructive";
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  onClick,
  ...props
}: ItemProps) {
  const { setOpen } = useDropdown();
  return (
    <button
      type="button"
      role="menuitem"
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors",
        "focus-visible:bg-accent focus-visible:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        variant === "destructive" &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div role="none" className={cn("-mx-1 my-1 h-px bg-border", className)} />;
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
