const staticRoutes = new Set([
  "/dashboard",
  "/notifications",
  "/profile",
  "/settings",
  "/billing",
  "/projects",
  "/tasks",
  "/workspace",
  "/analytics",
  "/activity",
  "/activity-logs",
  "/ai-assistant",
  "/ai-agents",
  "/workflows",
  "/admin",
  "/admin/analytics",
  "/admin/audit-logs",
  "/admin/users",
  "/admin/workspaces",
]);

const dynamicRoutes = [
  /^\/projects\/[^/]+$/,
  /^\/accept-invitation\/[^/]+$/,
  /^\/ai-agents\/[^/]+$/,
  /^\/workflows\/[^/]+$/,
];

export function getSafeNotificationDestination(link: string | null) {
  if (!link) return null;

  try {
    const destination = new URL(link, window.location.origin);
    if (destination.origin !== window.location.origin) return null;

    const isKnownRoute =
      staticRoutes.has(destination.pathname) ||
      dynamicRoutes.some((pattern) => pattern.test(destination.pathname));

    return isKnownRoute
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : null;
  } catch {
    return null;
  }
}
