import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/actions/noti-actions";

// Hook quản lý notification cho toàn app
export function useNotification(options = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách thông báo từ API
  const fetchNotifications = useCallback(
    async (opts) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getNotifications(opts || options);
        setNotifications(data.notifications || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  // Đánh dấu 1 thông báo đã đọc
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      setError(err);
    }
  }, []);

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      setError(err);
    }
  }, []);

  // Tự động fetch khi mount hoặc options thay đổi
  useEffect(() => {
    fetchNotifications(options);
  }, [fetchNotifications, options]);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead
  };
}