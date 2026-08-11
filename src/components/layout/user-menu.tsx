"use client";

import { CreditCard, LogOut, Settings, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockUser } from "@/lib/navigation";
import { RoleBadge } from "@/components/roles/role-badge";
import { RoleSwitcher } from "@/components/roles/role-switcher";
import { useRole } from "@/context/role-context";

/**
 * Account menu in the navbar. All actions are UI-only placeholders.
 */
export function UserMenu() {
  const { role } = useRole();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className={cn(
          "flex items-center gap-2 rounded-full outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <Avatar name={mockUser.name} src={mockUser.avatarUrl} className="size-8" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-60">
        <div className="flex items-center gap-2.5 p-2">
          <Avatar name={mockUser.name} src={mockUser.avatarUrl} className="size-9" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{mockUser.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {mockUser.email}
            </span>
            <RoleBadge role={role} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <RoleSwitcher />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        {/* TODO: Route to profile settings. */}
        <DropdownMenuItem>
          <User />
          Profile
        </DropdownMenuItem>
        {/* TODO: Route to workspace settings. */}
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        {/* TODO: Route to billing. */}
        <DropdownMenuItem>
          <CreditCard />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* TODO: Connect sign-out to auth logout. */}
        <DropdownMenuItem variant="destructive">
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
