import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Users,
  Bell,
  Activity,
  BarChart3,
  Sparkles,
  Bot,
  Workflow,
  Settings,
} from "lucide-react";

import type { AppUser, NavSection, Workspace } from "@/types";

/**
 * Shared navigation config for the sidebar and mobile drawer.
 * Routes point at sections defined in the build plan; pages arrive in later
 * phases, so several are marked `disabled` to render a "coming soon" hint.
 */
export const navSections: NavSection[] = [
  {
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      {
        title: "Projects",
        href: "/projects",
        icon: FolderKanban,
      },
      { title: "Tasks", href: "/tasks", icon: ListChecks },
      { title: "Workspace", href: "/workspace", icon: Users },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      { title: "Activity Logs", href: "/activity", icon: Activity },
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: "3",
      },
    ],
  },
  {
    label: "Automate",
    items: [
      { title: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
      { title: "AI Agents", href: "/ai-agents", icon: Bot },
      {
        title: "Workflows",
        href: "/workflows",
        icon: Workflow,
      },
    ],
  },
];

/** Secondary nav pinned to the bottom of the sidebar. */
export const secondaryNav: NavSection = {
  items: [
    { title: "Settings", href: "/settings", icon: Settings, disabled: true },
  ],
};

// TODO: Replace with the authenticated user from the backend session.
export const mockUser: AppUser = {
  name: "Ada Lovelace",
  email: "ada@flowdesk.io",
  role: "Workspace admin",
};

// TODO: Replace with the user's real workspaces from the backend.
export const mockWorkspaces: Workspace[] = [
  { id: "ws_core", name: "FlowDesk Core", plan: "Business" },
  { id: "ws_growth", name: "Growth Team", plan: "Pro" },
  { id: "ws_personal", name: "Personal", plan: "Free" },
];
