import { Users, FolderKanban } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/hooks/use-chat";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { cn, capitalCase, formatShortTimestamp } from "@/lib/utils";

export default function NavConversationItem({ conversation }) {
  const { selectedConversationId, changeConversation } = useChat();
  const selected = conversation.id === selectedConversationId;

  return (
    <li
      onClick={() => changeConversation(conversation.id)}
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 w-full px-5 py-3 transition duration-200 ease-in-out",
        selected ? "bg-prussian-blue/5" : "hover:bg-prussian-blue/5"
      )}
    >
      {/* Column 1: Avatar */}
      <div className="flex-none relative">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={conversation.avatar_url}
            alt={conversation.title}
            className="object-cover"
          />
          <AvatarFallback style={pickAvatarColor(conversation.title)}>
            {conversation.type === "direct" ? (
              getInitials(conversation.title)
            ) : conversation.type === "team" ? (
              <Users />
            ) : (
              <FolderKanban />
            )}
          </AvatarFallback>
        </Avatar>
        {conversation.unread_count > 0 && (
          <Badge className="text-xs bg-prussian-blue absolute h-5 w-5 -bottom-1 -right-1 transform -translate-y-0.5 z-10">
            {conversation.unread_count < 10 ? conversation.unread_count : "9+"}
          </Badge>
        )}
      </div>

      {/* Column 2: Text */}
      <div className="flex flex-col min-w-0 overflow-hidden">
        <div className="flex gap-2 items-center overflow-hidden">
          <p
            className={cn(
              "text-left text-sm font-medium text-gray-900 truncate",
              conversation.unread_count > 0 && "font-bold"
            )}
          >
            {conversation?.title ||
              (conversation?.type === "direct"
                ? "Direct Message"
                : conversation?.type === "team"
                ? "Team Chat"
                : "Project Chat")}
          </p>
          {conversation?.type !== "direct" && (
            <Badge
              className={cn(
                "flex-none text-[10px] rounded-sm h-4",
                conversation?.type === "team" ? "bg-red-400" : "bg-blue-400"
              )}
            >
              {capitalCase(conversation?.type)}
            </Badge>
          )}
        </div>
        <p
          className={cn(
            "text-left text-xs text-gray-500 truncate",
            conversation.unread_count > 0 && "font-bold"
          )}
        >
          {conversation.latest_message_content || "No messages yet"}
        </p>
      </div>

      {/* Column 3: Timestamp */}
      <div className="flex-none text-end min-w-10">
        <span className="text-xs text-gray-500">
          {conversation.latest_message_at && formatShortTimestamp(conversation.latest_message_at)}
        </span>
      </div>
    </li>
  );
}
