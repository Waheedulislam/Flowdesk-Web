"use client";

import * as React from "react";

import { useAuth } from "@/context/auth-context";
import { socket } from "@/lib/socket";
import {
  deleteNotification as deleteNotificationRequest,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationRecord,
} from "@/lib/api/notification.api";

type NotificationContextValue = {
  notifications: NotificationRecord[];
  unreadCount: number;
  isLoading: boolean;
  isMarkingAllAsRead: boolean;
  error: string | null;
  pendingIds: ReadonlySet<string>;
  reload: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
};

const NotificationContext =
  React.createContext<NotificationContextValue | null>(null);

type NotificationOverride = {
  notification: NotificationRecord | null;
  version: number;
};

function sortNotifications(notifications: NotificationRecord[]) {
  return [...notifications].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, isReady, user } = useAuth();
  const [notifications, setNotifications] = React.useState<
    NotificationRecord[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());
  const requestId = React.useRef(0);
  const pendingIdsRef = React.useRef(new Set<string>());
  const notificationOverridesRef = React.useRef(
    new Map<string, NotificationOverride>(),
  );
  const notificationOverrideVersionRef = React.useRef(0);
  const hasConnectedRef = React.useRef(false);

  const reload = React.useCallback(async () => {
    const currentRequestId = ++requestId.current;
    const overrideVersionAtStart = notificationOverrideVersionRef.current;

    if (!isReady || !accessToken) {
      setNotifications([]);
      setError(null);
      setIsLoading(false);
      pendingIdsRef.current.clear();
      setPendingIds(new Set());
      setIsMarkingAllAsRead(false);
      notificationOverridesRef.current.clear();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getNotifications(accessToken);
      if (requestId.current !== currentRequestId) return;
      const nextNotifications = new Map(
        response.data.map((notification) => [notification.id, notification]),
      );

      for (const [
        notificationId,
        override,
      ] of notificationOverridesRef.current) {
        if (override.version > overrideVersionAtStart) {
          if (override.notification) {
            nextNotifications.set(notificationId, override.notification);
          } else {
            nextNotifications.delete(notificationId);
          }
        }
        notificationOverridesRef.current.delete(notificationId);
      }

      setNotifications(sortNotifications([...nextNotifications.values()]));
    } catch (cause) {
      if (requestId.current !== currentRequestId) return;
      setError(
        cause instanceof Error
          ? cause.message
          : "We couldn't load your notifications. Please try again.",
      );
    } finally {
      if (requestId.current === currentRequestId) setIsLoading(false);
    }
  }, [accessToken, isReady]);

  React.useEffect(() => {
    if (!isReady || !accessToken || !user) return;

    const handleNewNotification = (notification: NotificationRecord) => {
      if (
        !notification ||
        typeof notification.id !== "string" ||
        notification.userId !== user.id
      ) {
        return;
      }

      notificationOverridesRef.current.set(notification.id, {
        notification,
        version: ++notificationOverrideVersionRef.current,
      });
      setNotifications((current) => {
        if (current.some((item) => item.id === notification.id)) return current;
        return sortNotifications([notification, ...current]);
      });
    };

    const handleConnect = () => {
      if (hasConnectedRef.current) void reload();
      hasConnectedRef.current = true;
    };

    socket.on("notification:new", handleNewNotification);
    socket.on("connect", handleConnect);
    if (socket.connected) hasConnectedRef.current = true;

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.off("connect", handleConnect);
    };
  }, [accessToken, isReady, reload, user]);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void reload(), 0);
    return () => {
      window.clearTimeout(timeoutId);
      requestId.current += 1;
    };
  }, [reload]);

  const addPendingId = React.useCallback((notificationId: string) => {
    pendingIdsRef.current.add(notificationId);
    setPendingIds(new Set(pendingIdsRef.current));
  }, []);

  const removePendingId = React.useCallback((notificationId: string) => {
    pendingIdsRef.current.delete(notificationId);
    setPendingIds(new Set(pendingIdsRef.current));
  }, []);

  const markAsRead = React.useCallback(
    async (notificationId: string) => {
      if (!accessToken || pendingIdsRef.current.has(notificationId)) return;

      const notification = notifications.find(
        (item) => item.id === notificationId,
      );
      if (!notification || notification.isRead) return;

      const currentRequestId = requestId.current;
      addPendingId(notificationId);
      try {
        const response = await markNotificationAsRead(
          accessToken,
          notificationId,
        );
        if (requestId.current === currentRequestId) {
          if (notificationOverridesRef.current.has(notificationId)) {
            notificationOverridesRef.current.set(notificationId, {
              notification: response.data,
              version: ++notificationOverrideVersionRef.current,
            });
          }
          setNotifications((current) =>
            current.map((item) =>
              item.id === notificationId ? response.data : item,
            ),
          );
        }
      } finally {
        removePendingId(notificationId);
      }
    },
    [accessToken, addPendingId, notifications, removePendingId],
  );

  const markAllAsRead = React.useCallback(async () => {
    if (
      !accessToken ||
      isMarkingAllAsRead ||
      !notifications.some((item) => !item.isRead)
    ) {
      return;
    }

    const currentRequestId = requestId.current;
    setIsMarkingAllAsRead(true);
    try {
      await markAllNotificationsAsRead(accessToken);
      if (requestId.current === currentRequestId) {
        for (const [
          notificationId,
          override,
        ] of notificationOverridesRef.current) {
          if (override.notification && !override.notification.isRead) {
            notificationOverridesRef.current.set(notificationId, {
              notification: { ...override.notification, isRead: true },
              version: ++notificationOverrideVersionRef.current,
            });
          }
        }
        setNotifications((current) =>
          current.map((item) => ({ ...item, isRead: true })),
        );
      }
    } finally {
      setIsMarkingAllAsRead(false);
    }
  }, [accessToken, isMarkingAllAsRead, notifications]);

  const deleteNotification = React.useCallback(
    async (notificationId: string) => {
      if (!accessToken || pendingIdsRef.current.has(notificationId)) return;

      const currentRequestId = requestId.current;
      addPendingId(notificationId);
      try {
        await deleteNotificationRequest(accessToken, notificationId);
        if (requestId.current === currentRequestId) {
          if (notificationOverridesRef.current.has(notificationId)) {
            notificationOverridesRef.current.set(notificationId, {
              notification: null,
              version: ++notificationOverrideVersionRef.current,
            });
          }
          setNotifications((current) =>
            current.filter((item) => item.id !== notificationId),
          );
        }
      } finally {
        removePendingId(notificationId);
      }
    },
    [accessToken, addPendingId, removePendingId],
  );

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      isMarkingAllAsRead,
      error,
      pendingIds,
      reload,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }),
    [
      deleteNotification,
      error,
      isLoading,
      isMarkingAllAsRead,
      markAllAsRead,
      markAsRead,
      notifications,
      pendingIds,
      reload,
      unreadCount,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
}
