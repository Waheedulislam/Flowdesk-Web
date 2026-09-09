"use client";

import * as React from "react";
import { getWorkspaceActivity, type ActivityLog } from "@/lib/api/activity.api";

type Options = {
  accessToken: string | null;
  isReady: boolean;
  workspaceId: string;
  projectId: string;
};

function belongsToProject(activity: ActivityLog, projectId: string) {
  if (activity.entity === "PROJECT" && activity.entityId === projectId) {
    return true;
  }
  return activity.metadata?.projectId === projectId;
}

export function useProjectActivity({
  accessToken,
  isReady,
  workspaceId,
  projectId,
}: Options) {
  const [activities, setActivities] = React.useState<ActivityLog[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);

  const reload = React.useCallback(async () => {
    const id = ++requestId.current;
    setActivities([]);
    if (!isReady || !accessToken || !workspaceId || !projectId) {
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getWorkspaceActivity(accessToken, workspaceId, {
        page: 1,
        limit: 100,
      });
      if (requestId.current === id) {
        setActivities(
          response.data.filter((activity) =>
            belongsToProject(activity, projectId),
          ),
        );
      }
    } catch (requestError) {
      if (requestId.current === id) {
        setActivities([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load project activity.",
        );
      }
    } finally {
      if (requestId.current === id) setLoading(false);
    }
  }, [accessToken, isReady, projectId, workspaceId]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [reload]);

  return { activities, loading, error, reload };
}
