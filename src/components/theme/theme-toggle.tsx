"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

/**
 * Theme switcher with light / dark / system.
 * Hydration-safe: shows a neutral Sun icon until mounted so the server and
 * client markup match, then reflects the resolved theme.
 */
export function ThemeToggle({ align = "end" }: { align?: "start" | "end" }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const showMoon = mounted && resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Toggle theme"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative",
        )}
      >
        <Sun
          className={cn(
            "size-4 transition-all",
            showMoon && "-rotate-90 scale-0",
          )}
        />
        <Moon
          className={cn(
            "absolute size-4 transition-all",
            showMoon ? "rotate-0 scale-100" : "rotate-90 scale-0",
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-40">
        {options.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <Icon />
              {label}
            </span>
            {mounted && theme === value ? (
              <span className="size-1.5 rounded-full bg-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
