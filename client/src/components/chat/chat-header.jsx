"use client";

import { useMemo } from "react";
import { Users, UsersRound, FolderKanban } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useChat } from "@/hooks/use-chat";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { cn, capitalCase } from "@/lib/utils";

export default function ChatHeader() {
  const { conversations, selectedConversationId } = useChat();

  const currConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  if (!currConversation) {
    return;
  }

  return (
    <div className="flex w-full h-20 max-w-full gap-4 items-center border-b bg-white px-6 py-4">
      <Avatar className="h-12 w-12 relative">
        <AvatarImage
          src={currConversation.avatar_url}
          alt={currConversation.title}
          className="object-cover"
        />
        <AvatarFallback style={pickAvatarColor(currConversation.title)}>
          {currConversation.type === "direct" ? (
            getInitials(currConversation.title)
          ) : currConversation.type === "team" ? (
            <Users />
          ) : (
            <FolderKanban />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="max-w-4/5">
        <div className="flex-none text-xl font-semibold truncate">
          {currConversation.title ||
            (currConversation.type === "direct"
              ? "Direct Message"
              : currConversation.type === "team"
              ? "Team Chat"
              : "Project Chat")}
        </div>
        <div className="flex items-center gap-2">
          {currConversation.type !== "direct" && (
            <Badge
              className={cn(
                "flex-none text-[10px] rounded-sm h-4",
                currConversation.type === "team" ? "bg-red-400" : "bg-blue-400"
              )}
            >
              {capitalCase(currConversation.type)}
            </Badge>
          )}
          {currConversation.type !== "direct" && (
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <div className="flex items-center px-2 py-1 gap-1 text-xs text-gray-500 rounded-sm hover:bg-prussian-blue/10 hover:cursor-pointer transition duration-200 ease-in-out">
                    <UsersRound className="h-3 w-3" />
                    <span>{currConversation.participant_count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-prussian-blue text-white">
                  <p>{`${currConversation.participant_count} members`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
