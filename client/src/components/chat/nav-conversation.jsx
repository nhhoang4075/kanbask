"use client";

import { Users, FolderKanban } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { formatShortTimestamp } from "@/lib/chat-utils";
import { getInitials } from "@/lib/user-utils";

export default function NavConversation() {
  const { conversations, selectedConversationId, setSelectedConversationId } = useChat();

  return (
    <Card className="h-full shadow-lg rounded-none overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="px-6 py-4 bg-white border-b">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>

        <ScrollArea className="flex-1 bg-white">
          <ul className="divide-y divide-gray-200">
            {conversations.map((c) => {
              const selected = c.id === selectedConversationId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedConversationId(c.id)}
                    className={cn(
                      "flex items-center justify-between w-full px-5 py-3 transition duration-150 ease-in-out",
                      selected ? "bg-indigo-50" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
                        className={cn(
                          "h-12 w-12",
                          selected && "ring-1 ring-prussian-blue overflow-hidden"
                        )}
                      >
                        <AvatarImage
                          src={c.avatar_url}
                          alt={c.title || c.id}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-mustard">
                          {/* {(c.title || c.id).toString().charAt(0).toUpperCase()} */}
                          {c.type === "direct" ? (
                            getInitials(c.title)
                          ) : c.type === "team" ? (
                            <Users />
                          ) : (
                            <FolderKanban />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-left text-sm font-medium text-gray-900 truncate max-w-40">
                          {c.title || c.id}
                        </p>
                        <p className="text-left text-xs text-gray-500 truncate max-w-40">
                          {c.latest_message_content || "No messages yet"}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col items-end space-y-1">
                      <span className="text-xs text-gray-400">
                        {c.latest_message_at && formatShortTimestamp(c.latest_message_at)}
                      </span>
                      {c.unread_count > 0 && (
                        <Badge className="text-xs" variant="destructive" size="sm">
                          {c.unread_count}
                        </Badge>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
