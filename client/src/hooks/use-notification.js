"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/actions/notification-actions";
import { useSocket } from "@/hooks/use-socket";

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { socket, connected: socketConnected } = useSocket();

  const typeOptions = [
    { value: "all", label: "All Notifications" },
    { value: "team", label: "Team Notifications" },
    { value: "project", label: "Project Notifications" },
    { value: "task", label: "Task Notifications" }
  ];

  const setUnreadNotifications = useCallback(() => {
    setUnreadCount(notifications.filter((n) => !n.is_read).length);
  }, [notifications]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.notifications?.filter((n) => !n.is_read).length || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
    typeOptions,
    type,
    setType,
    loading,
    error,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
  );
}
