"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/actions/notification-actions";
import { useSocket } from "@/hooks/use-socket";

const NOTIFICATION_LIMIT = 20;

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { socket, connected: socketConnected } = useSocket();

  const filterOptions = [
    { value: "all", label: "All Notifications" },
    { value: "team", label: "Team Notifications" },
    { value: "project", label: "Project Notifications" },
    { value: "task", label: "Task Notifications" }
  ];

  // Fetch notifications
  const fetchNotifications = useCallback(
    async ({ limit = NOTIFICATION_LIMIT, offset = 0, append = false }) => {
      try {
        append ? setLoadingMore(true) : setLoadingInitial(true);
        setError(null);

        const data = await getNotifications({ limit, offset });

        if (append) {
          setNotifications((prev) => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }

        setHasMore(data.notifications.length === NOTIFICATION_LIMIT);
        setOffset(offset + data.notifications.length);
      } catch (err) {
        setError(err);
      } finally {
        append ? setLoadingMore(false) : setLoadingInitial(false);
      }
    },
    []
  );

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.is_read).length || 0);
  }, [notifications]);

  // Mark a single notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        const target = notifications.find((n) => n.id === notificationId);

        if (!target || target?.is_read) {
          return;
        }

        await markNotificationAsRead(notificationId);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => prev - 1);
      } catch (err) {
        setError(err);
      }
    },
    [notifications]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err);
    }
  }, []);

  const loadMore = useCallback(async () => {
    await fetchNotifications({ offset, append: true });
  }, [fetchNotifications, offset]);

  // Initial fetch
  useEffect(() => {
    if (hasMore) {
      fetchNotifications({ limit: NOTIFICATION_LIMIT, offset: 0, append: false });
    }
  }, [fetchNotifications, hasMore]);

  useEffect(() => {
    if (!socket || !socketConnected) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, socketConnected]);

  const contextValue = {
    notifications,
    unreadCount,
    filterOptions,
    filter,
    setFilter,
    loadingInitial,
    loadingMore,
    error,
    markAsRead,
    markAllAsRead,
    hasMore,
    loadMore
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
}
