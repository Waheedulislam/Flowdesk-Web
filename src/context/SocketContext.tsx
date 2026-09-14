"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { useWorkspace } from "@/context/workspace-context";
import { socket } from "@/lib/socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, isAuthenticated, isReady } = useAuth();
  const { workspaces } = useWorkspace();

  React.useEffect(() => {
    if (!isReady || !isAuthenticated || !accessToken) {
      socket.disconnect();
      return;
    }

    socket.auth = { accessToken };

    const handleConnectError = (error: Error) => {
      if (error.message === "unauthorized") socket.disconnect();
    };

    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [accessToken, isAuthenticated, isReady]);

  React.useEffect(() => {
    if (!isReady || !isAuthenticated) return;

    const joinActiveWorkspaces = () => {
      workspaces
        .filter((workspace) => workspace.status === "ACTIVE")
        .forEach((workspace) => {
          socket.emit("join-workspace", workspace.id, () => undefined);
        });
    };

    socket.on("connect", joinActiveWorkspaces);
    if (socket.connected) joinActiveWorkspaces();

    return () => {
      socket.off("connect", joinActiveWorkspaces);
    };
  }, [isAuthenticated, isReady, workspaces]);

  return <>{children}</>;
}
