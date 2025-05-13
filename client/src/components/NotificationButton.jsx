"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";

export default function NotificationButton({ notifications }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        variant="ghost"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Show Notifications"
      >
        Thông báo ({notifications?.length || 0})
      </Button>

      {showNotifications && (
        <div
          ref={notificationRef}
          className="fixed top-16 right-4 w-72 bg-white shadow-lg rounded-md p-4 dark:bg-gray-700 border border-black z-[9999]"
        >
          {(notifications?.length || 0) === 0 ? (
            <p className="text-sm font-medium dark:text-white">Không có thông báo mới.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((item, index) => (
                <li key={index} className="text-sm text-gray-800 dark:text-white border-b pb-2">
                  <div className="font-semibold">{item.type}</div>
                  <div>{item.content}</div>
                  <div className="text-xs text-gray-500">ID: {item.reference_id}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
