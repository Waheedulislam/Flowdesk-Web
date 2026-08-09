"use client";

import { Sheet } from "@/components/ui/sheet";
import { BrandMark } from "@/components/layout/brand-mark";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { navSections, secondaryNav } from "@/lib/navigation";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Mobile navigation drawer. Mirrors the desktop sidebar contents inside a
 * Sheet; closes automatically on navigation.
 */
export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      side="left"
      title="Navigation"
      hideTitle
    >
      <div className="flex flex-col gap-4 px-3 pb-4">
        <div className="px-1">
          <BrandMark />
        </div>
        <WorkspaceSwitcher />
        <SidebarNav sections={navSections} onNavigate={close} />
        <div className="border-t border-sidebar-border pt-4">
          <SidebarNav sections={[secondaryNav]} onNavigate={close} />
        </div>
      </div>
    </Sheet>
  );
}
