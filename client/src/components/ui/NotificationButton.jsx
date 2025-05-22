"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronDown,
  User as UserIcon,
  Users,
  FolderKanban,
  ClipboardList
} from "lucide-react";
import { useNotification } from "@/hooks/use-notification"; // <-- import hook mới

// Helper để nhóm thông báo
function groupNotificationsByDate(notifications) {
  const groups = { Today: [], Yesterday: [], "Last Week": [], More: [] };
  const now = new Date();
  notifications.forEach((n) => {
    const date = new Date(n.created_at);
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      groups.Today.push(n);
    } else if (diffDays === 1) {
      groups.Yesterday.push(n);
    } else if (diffDays <= 7) {
      groups["Last Week"].push(n);
    } else {
      groups.More.push(n);
    }
  });
  return groups;
}

function getTypeIcon(type) {
  switch (type) {
    case "task":
      return <ClipboardList className="w-5 h-5 text-blue-500" />;
    case "project":
      return <FolderKanban className="w-5 h-5 text-green-500" />;
    case "team":
      return <Users className="w-5 h-5 text-purple-500" />;
    default:
      return <UserIcon className="w-5 h-5 text-gray-400" />;
  }
}

export default function NotificationButton() {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("all"); // "all" hoặc "unread"
  const [typeFilter, setTypeFilter] = useState("all"); // "all", "task", "project", "team"
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const { notifications, markAsRead, markAllAsRead } = useNotification();

  // Hàm đếm số lượng thông báo chưa đọc, đã lọc theo typeFilter
  const getUnreadCount = () => {
    let filteredByType =
      typeFilter === "all"
        ? notifications
        : notifications.filter((n) => n.reference_type === typeFilter);
    return filteredByType.filter((n) => !n.is_read).length;
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        (!typeDropdownRef.current || !typeDropdownRef.current.contains(e.target))
      ) {
        setShow(false);
        setShowTypeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let filtered = filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications;

  filtered =
    typeFilter === "all" ? filtered : filtered.filter((n) => n.reference_type === typeFilter);

  const groups = groupNotificationsByDate(filtered);

  function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffM = (now - date) / 1000 / 60;
    if (diffM < 0) return `Invalid date`;
    if (diffM < 60) return `${Math.floor(diffM)}m`;
    if (diffM < 1440) return `${Math.floor(diffM / 60)}h`;
    return date.toLocaleDateString();
  }

  function renderContent(content) {
    const regex = /<@([^>]+)>/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={key++} className="font-bold text-prussian-blue">
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }
    return parts;
  }

  const typeFilterLabel = {
    all: "All Notifications",
    task: "Task Notifications",
    project: "Project Notifications",
    team: "Team Notifications"
  };

  const typeOptions = [
    { value: "all", label: "All Notifications" },
    { value: "task", label: "Task Notifications" },
    { value: "project", label: "Project Notifications" },
    { value: "team", label: "Team Notifications" }
  ];

  return (
    <div className="relative">
      {/* nút bell và badge */}
      <Button
        onClick={() => setShow(!show)}
        className="relative flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-md shadow hover:shadow-md"
        aria-label="Toggle Notifications"
      >
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        {getUnreadCount() > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
            {getUnreadCount()}
          </span>
        )}
      </Button>

      {show && (
        <div
          ref={dropdownRef}
          className="absolute bottom-10 h-100 w-96 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 relative">
            <div className="flex items-center gap-1 text-lg font-semi text-gray-900 dark:text-white">
              {typeFilterLabel[typeFilter]}
              <button
                className="ml-1 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowTypeDropdown((v) => !v)}
                aria-label="Change notification type"
                type="button"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTypeDropdown && (
                <div
                  ref={typeDropdownRef}
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10"
                >
                  <ul>
                    {typeOptions
                      .filter((opt) => opt.value !== typeFilter)
                      .map((opt) => (
                        <li key={opt.value}>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setTypeFilter(opt.value);
                              setShowTypeDropdown(false);
                            }}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline">
              Mark all as read
            </button>
          </div>

          {/* Tabs: All / Unread */}
          <div className="flex items-center px-4 py-2 space-x-6 border-b dark:border-gray-700">
            <button
              onClick={() => setFilter("all")}
              className={`text-sm font-medium ${
                filter === "all"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`text-sm font-medium flex items-center ${
                filter === "unread"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Unread
              {getUnreadCount() > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                  {getUnreadCount()}
                </span>
              )}
            </button>
          </div>

          {/* Notification list */}
          <div className="max-h-80 pb-5 overflow-y-auto">
            {Object.entries(groups).map(([label, items]) =>
              items.length > 0 ? (
                <div key={label} className="px-4 py-1">
                  <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                    {label}
                  </div>
                  <ul className="space-y-1">
                    {items.map((n, idx) => (
                      <div key={n.id}>
                        <li
                          key={n.id}
                          className={`flex items-start space-x-3 cursor-pointer transition hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-2 ${
                            n.is_read ? "" : "bg-blue-50 dark:bg-gray-900"
                          }`}
                          style={{
                            borderLeft: "4px solid #023047ff",
                            backgroundClip: "padding-box"
                          }}
                          onClick={() => markAsRead(n.id)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Đánh dấu đã đọc: ${n.title}`}
                        >
                          {/* Icon theo reference_type */}
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700">
                            {getTypeIcon(n.reference_type)}
                          </div>
                          {/* Content */}
                          <div className="flex-1">
                            <div className="text-sm text-gray-900 dark:text-white">
                              <span className="font-semibold">{n.userName}</span>
                              {""}
                              {n.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {renderContent(n.content)}
                            </div>
                          </div>
                          {/* Timestamp & unread dot */}
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatTime(n.created_at)}
                            </span>
                            {!n.is_read && (
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-1" />
                            )}
                          </div>
                        </li>
                        {idx < items.length - 1 && (
                          <div className="border-b border-gray-200 dark:border-gray-700"></div>
                        )}
                      </div>
                    ))}
                  </ul>
                  {/* Divider */}
                  {label !== "More" && (
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-3" />
                  )}
                </div>
              ) : null
            )}

            {filtered.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                There are no notifications.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
