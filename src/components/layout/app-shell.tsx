"use client";

import * as React from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppFooter } from "@/components/layout/app-footer";

/**
 * The main authenticated application shell: fixed sidebar + sticky navbar with
 * a scrollable content region. Holds the collapse and mobile-drawer UI state.
 *
 * Wrap page content with <AppShell> in route layouts. Auth pages (login,
 * register, etc.) render outside this shell.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>

        <AppFooter />
        {/*
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} FlowDesk. All rights reserved.
          </p>
        */}
      </div>
    </div>
  );
}
