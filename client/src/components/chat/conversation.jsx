import { cn } from "@/lib/utils";
import { formatShortTimestamp } from "@/lib/chat-utils";
import { getInitials } from "@/lib/user-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, FolderKanban } from "lucide-react";

export default function Conversation({ currConv, setSelectedConversationId, selected }) {
  return (
    <li>
      <button
        onClick={() => setSelectedConversationId(currConv.id)}
        className={cn(
          "flex items-center justify-between w-full px-5 py-3 transition duration-150 ease-in-out",
          selected ? "bg-indigo-50" : "hover:bg-gray-50"
        )}
      >
        <div className="flex items-center space-x-4">
          <div>
            <Avatar
              className={cn(
                "h-12 w-12 relative",
                selected && "ring-1 ring-prussian-blue overflow-hidden"
              )}
            >
              <AvatarImage
                src={currConv?.avatar_url}
                alt={currConv?.title || currConv?.id}
                className="object-cover"
              />
              <AvatarFallback className="bg-mustard">
                {currConv?.type === "direct" ? (
                  getInitials(currConv?.title)
                ) : currConv?.type === "team" ? (
                  <Users />
                ) : (
                  <FolderKanban />
                )}
              </AvatarFallback>
            </Avatar>
            {currConv.unread_count > 0 && (
              <Badge className="text-xs bg-prussian-blue absolute h-5 w-5 top-11 left-13 transform -translate-y-0.5 z-10">
                {currConv.unread_count < 10 ? currConv.unread_count : "9+"}
              </Badge>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex gap-2 items-center">
              <p className={cn("flex-1 text-left text-sm font-medium text-gray-900 truncate max-w-40", currConv.unread_count > 0 && "font-bold")}>
                {currConv?.title || 
                  (currConv?.type === "direct" ? 
                    "Direct Message" : (currConv?.type === "team" ? 
                      "Team Chat" : "Project Chat"))}
              </p>
              {currConv?.type === "team" && (
                <Badge className="flex-none text-[10px] rounded-md bg-red-500 h-4">
                  Team
                </Badge>
              )}
              {currConv?.type === "project" && (
                <Badge className="flex-none text-[10px] rounded-md bg-blue-500 h-4">
                  Project
                </Badge>
              )}
            </div>
            <p className={cn("text-left text-xs text-gray-500 truncate max-w-40", currConv.unread_count > 0 && "font-bold")}>
              {currConv.latest_message_content || "No messages yet"}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-end min-h-[36px]">
          <span className="text-xs text-gray-400">
            {currConv.latest_message_at && formatShortTimestamp(currConv.latest_message_at)}
          </span>
        </div>
      </button>
    </li>
  );
}