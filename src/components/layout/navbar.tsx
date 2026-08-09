"use client";

import { Bell, Menu, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

interface NavbarProps {
  onOpenMobileNav: () => void;
}

/**
 * Top application bar. Sticky, with a mobile menu trigger, a search entry
 * point, notifications, the theme toggle, and the account menu.
 */
export function Navbar({ onOpenMobileNav }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation menu"
        onClick={onOpenMobileNav}
      >
        <Menu />
      </Button>

      {/* Search — opens a command palette later. */}
      {/* TODO: Connect to global search / command palette. */}
      <button
        type="button"
        className={cn(
          "group flex h-9 flex-1 items-center gap-2 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground outline-none transition-colors",
          "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:max-w-sm",
        )}
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search FlowDesk…</span>
        <span className="ml-auto hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground md:inline-flex">
          ⌘K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1">
        {/* TODO: Connect to notifications feed. */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
        <ThemeToggle />
        <div className="mx-1 h-6 w-px bg-border" aria-hidden />
        <UserMenu />
      </div>
    </header>
  );
}
