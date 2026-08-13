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
import type { UserRole } from "@/context/role-context";

/**
 * Shared navigation config for the sidebar and mobile drawer.
 * Routes point at sections defined in the build plan; pages arrive in later
 * phases, so several are marked `disabled` to render a "coming soon" hint.
 */
export const navSections: NavSection[] = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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

export function getNavigationForRole(role: UserRole): NavSection[] {
  const dashboard = { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard };
  const projects = { title: "Projects", href: "/projects", icon: FolderKanban };
  const tasks = { title: role === "member" ? "My Tasks" : "Tasks", href: "/tasks", icon: ListChecks };
  const automate = { label: "Automate", items: [{ title: "AI Assistant", href: "/ai-assistant", icon: Sparkles }, ...(role === "member" ? [] : [{ title: "AI Agents", href: "/ai-agents", icon: Bot }]), ...(role === "member" ? [] : [{ title: "Workflows", href: "/workflows", icon: Workflow }])] };
  if (role === "member") return [{ items: [dashboard, projects, tasks, { title: "Notifications", href: "/notifications", icon: Bell, badge: "3" }] }, automate];
  const core = [dashboard, projects, tasks, { title: "Workspace", href: "/workspace", icon: Users }];
  const insights = { label: "Insights", items: [{ title: "Analytics", href: "/analytics", icon: BarChart3 }, { title: "Activity Logs", href: "/activity", icon: Activity }, { title: "Notifications", href: "/notifications", icon: Bell, badge: "3" }] };
  if (role === "admin") return [{ items: core }, insights, automate];
  return [{ items: [dashboard, { title: "Users", href: "/admin/users", icon: Users }, { title: "Workspaces", href: "/admin/workspaces", icon: FolderKanban }, projects, tasks] }, { label: "Administration", items: [{ title: "Admin Dashboard", href: "/admin", icon: LayoutDashboard }, { title: "System Analytics", href: "/admin/analytics", icon: BarChart3 }, { title: "Audit Logs", href: "/admin/audit-logs", icon: Activity }] }, insights, automate];
}

/** Secondary nav pinned to the bottom of the sidebar. */
export const secondaryNav: NavSection = {
  items: [
    { title: "Settings", href: "/settings", icon: Settings },
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
