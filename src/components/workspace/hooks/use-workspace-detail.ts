"use client";

import * as React from "react";

import {
  getWorkspaceBySlug,
  type WorkspaceDetail,
} from "@/lib/api/workspace.api";

type UseWorkspaceDetailOptions = {
  accessToken: string | null;
  isReady: boolean;
  slug: string | undefined;
};

export function useWorkspaceDetail({
  accessToken,
  isReady,
  slug,
}: UseWorkspaceDetailOptions) {
  const [detail, setDetail] = React.useState<WorkspaceDetail | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isReady || !accessToken || !slug) {
      const timeoutId = window.setTimeout(() => {
        setDetail(null);
        setError(null);
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }

    let ignored = false;
    const timeoutId = window.setTimeout(() => {
      setDetail(null);
      setError(null);
    }, 0);

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
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load workspace details.",
          );
        }
      })
      .finally(() => {
        if (!ignored) {
          window.clearTimeout(timeoutId);
        }
      });

    return () => {
      ignored = true;
      window.clearTimeout(timeoutId);
    };
  }, [accessToken, isReady, slug]);

  return { detail, error };
}
