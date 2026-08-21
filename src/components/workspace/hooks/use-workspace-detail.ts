"use client";

import * as React from "react";

import { getWorkspaceBySlug, type WorkspaceDetail } from "@/lib/api/workspace.api";

type UseWorkspaceDetailOptions = {
  accessToken: string | null;
  isReady: boolean;
  slug: string | undefined;
};

export function useWorkspaceDetail({ accessToken, isReady, slug }: UseWorkspaceDetailOptions) {
  const [detail, setDetail] = React.useState<WorkspaceDetail | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isReady || !accessToken || !slug) return;

    let ignored = false;
    void getWorkspaceBySlug(accessToken, slug)
      .then((response) => {
        if (!ignored) {
          setDetail(response.data);
          setError(null);
        }
      })
      .catch((requestError: unknown) => {
        if (!ignored) {
          setDetail(null);
          setError(requestError instanceof Error ? requestError.message : "Failed to load workspace details.");
        }
      });

    return () => {
      ignored = true;
    };
  }, [accessToken, isReady, slug]);

  return { detail, error };
}
