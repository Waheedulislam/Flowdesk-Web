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

import type { NavSection } from "@/types";
import type { UserRole } from "@/context/role-context";

/**
 * Shared navigation config for the sidebar and mobile drawer.
 */
export const navSections: NavSection[] = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        href: "/projects",
        icon: FolderKanban,
      },
      {
        title: "Tasks",
        href: "/tasks",
        icon: ListChecks,
      },
      {
        title: "Workspace",
        href: "/workspace",
        icon: Users,
      },
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
      {
        title: "Activity Logs",
        href: "/activity",
        icon: Activity,
      },
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
      {
        title: "AI Assistant",
        href: "/ai-assistant",
        icon: Sparkles,
      },
      {
        title: "AI Agents",
        href: "/ai-agents",
        icon: Bot,
      },
      {
        title: "Workflows",
        href: "/workflows",
        icon: Workflow,
      },
    ],
  },
];

export function getNavigationForRole(role: UserRole): NavSection[] {
  const dashboard = {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  };

  const projects = {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  };

  const tasks = {
    title: role === "USER" ? "My Tasks" : "Tasks",
    href: "/tasks",
    icon: ListChecks,
  };

  /**
   * Workspace is available to every authenticated application role.
   *
   * Application role:
   * SUPER_ADMIN / ADMIN / USER
   *
   * Workspace role is handled separately:
   * OWNER / ADMIN / MEMBER / GUEST
   */
  const workspace = {
    title: "Workspace",
    href: "/workspace",
    icon: Users,
  };

  const notifications = {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: "3",
  };

  const automate = {
    label: "Automate",
    items: [
      {
        title: "AI Assistant",
        href: "/ai-assistant",
        icon: Sparkles,
      },

      ...(role === "USER"
        ? []
        : [
            {
              title: "AI Agents",
              href: "/ai-agents",
              icon: Bot,
            },
          ]),

      ...(role === "USER"
        ? []
        : [
            {
              title: "Workflows",
              href: "/workflows",
              icon: Workflow,
            },
          ]),
    ],
  };

  /**
   * ============================================================
   * USER
   * ============================================================
   *
   * Normal users can also use Workspace.
   *
   * A USER can:
   * - create a workspace
   * - become OWNER of their workspace
   * - join other workspaces
   *
   * Workspace-level permissions are handled separately.
   */
  if (role === "USER") {
    return [
      {
        items: [dashboard, projects, tasks, workspace, notifications],
      },
      automate,
    ];
  }

  /**
   * ============================================================
   * ADMIN
   * ============================================================
   */

  const core = [dashboard, projects, tasks, workspace];

  const insights = {
    label: "Insights",
    items: [
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        title: "Activity Logs",
        href: "/activity",
        icon: Activity,
      },
      notifications,
    ],
  };

  if (role === "ADMIN") {
    return [
      {
        items: core,
      },
      insights,
      automate,
    ];
  }

  /**
   * ============================================================
   * SYSTEM ADMIN
   * ============================================================
   */

  return [
    {
      items: [
        dashboard,

        {
          title: "Users",
          href: "/admin/users",
          icon: Users,
        },

        {
          title: "Workspaces",
          href: "/admin/workspaces",
          icon: FolderKanban,
        },

        projects,
        tasks,
        workspace,
      ],
    },

    {
      label: "Administration",
      items: [
        {
          title: "Admin Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },

        {
          title: "System Analytics",
          href: "/admin/analytics",
          icon: BarChart3,
        },

        {
          title: "Audit Logs",
          href: "/admin/audit-logs",
          icon: Activity,
        },
      ],
    },

    insights,
    automate,
  ];
}

/**
 * Secondary nav pinned to the bottom of the sidebar.
 */
export const secondaryNav: NavSection = {
  items: [
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
};
