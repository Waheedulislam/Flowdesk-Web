import type { LucideIcon } from "lucide-react";

/** A single navigation entry in the sidebar or mobile drawer. */
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Optional short label for a counter badge (e.g. unread notifications). */
  badge?: string;
  /** Marks routes that are not built yet, so the UI can hint "coming soon". */
  disabled?: boolean;
}

/** Grouped navigation, letting the sidebar render labelled sections. */
export interface NavSection {
  label?: string;
  items: NavItem[];
}

/** Minimal shape for the signed-in user shown in the shell. */
export interface AppUser {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

/** A workspace the user belongs to, shown in the switcher. */
export interface Workspace {
  id: string;
  name: string;
  plan: "Free" | "Pro" | "Business" | "Enterprise";
}
