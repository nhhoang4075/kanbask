import { Users, FolderKanban, SquareCheckBig } from "lucide-react";

import { useNotification } from "@/hooks/use-notification";
import { cn, formatTimestampHour } from "@/lib/utils";

function highlightUser(content) {
  return content.replace(
    /<([^>]+)>/g,
    (match, username) => `<span class="text-prussian-blue font-medium">${username}</span>`
  );
}

export default function NotificationList({ group }) {
  const { markAsRead } = useNotification();

  return (
    <div key={group.date} className="space-y-2 mb-2">
      <div className="flex items-center gap-2 px-4">
        <h3 className="text-sm font-medium text-prussian-blue">{group.date}</h3>
        <div className="flex-1 h-px bg-prussian-blue" />
      </div>
      <div className="flex flex-col gap-2">
        {group.notifications.map((notification) => (
          <div
            key={notification.id}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-2 hover:bg-prussian-blue/10 transition duration-200 ease-in-out"
            onClick={() => markAsRead(notification.id)}
            tabIndex={0}
            role="button"
            aria-label={`Mark as read: ${notification.title}`}
          >
            <div
              className={cn(
                "p-3 rounded-md",
                notification.reference_type === "team" && "bg-blue-green text-white",
                notification.reference_type === "project" && "bg-prussian-blue text-white",
                notification.reference_type === "task" && "bg-mustard text-prussian-blue"
              )}
            >
              {notification.reference_type === "team" && <Users className="w-5 h-5" />}
              {notification.reference_type === "project" && <FolderKanban className="w-5 h-5" />}
              {notification.reference_type === "task" && <SquareCheckBig className="w-5 h-5" />}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium truncate">{notification.title}</p>
              <p
                className="text-xs text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: highlightUser(notification.content)
                }}
              />
            </div>
            <div className="flex justify-end gap-2 min-w-12">
              <span className="text-xs text-gray-400">
                {formatTimestampHour(notification.created_at)}
              </span>
              {!notification.is_read && <span className="w-2 h-2 bg-red-500 rounded-full mt-1" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
