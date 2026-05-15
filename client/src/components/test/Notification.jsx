"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Bell } from "lucide-react";

const socket = io(process.env.NEXT_PUBLIC_API_URL);

export default function Notification({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "unread"
  const dropdownRef = useRef();

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
        { method: "GET", credentials: "include" }
      );
      if (!res.ok) return;
      const { success, data } = await res.json();
      if (success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    socket.emit("setup", { user_id: userId });

    socket.on("new_notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      socket.off("new_notification");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userId]);

  const markAsRead = async (notification) => {
    try {
      if (notification.is_read) return;

      const { id } = notification;
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${id}`,
        { method: "PUT", credentials: "include" }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((count) => count - 1);
    } catch (err) {
      console.error("Error marking notification read", err);
    }
  };

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 hover:bg-gray-100 rounded-full"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 p-2 text-sm font-medium ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Recent
            </button>
            <button
              className={`flex-1 p-2 text-sm font-medium ${
                activeTab === "unread"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("unread")}
            >
              {unreadCount > 0 ? `Unread (${unreadCount})` : "Unread"}
            </button>
          </div>

          <div className="p-2 max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <p className="text-center text-gray-500">
                {activeTab === "unread"
                  ? "Không có thông báo chưa đọc"
                  : "Không có thông báo nào"}
              </p>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2 flex justify-between items-start space-x-2 hover:bg-gray-50 cursor-pointer ${
                    n.is_read ? "" : "bg-gray-100"
                  }`}
                  onClick={() => markAsRead(n)}
                >
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {n.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
