"use client";

import { Users, UsersRound, FolderKanban, MoreHorizontal } from "lucide-react";

import ChatOption from "@/components/chat/chat-option";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/hooks/use-chat";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { cn, capitalCase } from "@/lib/utils";

export default function ChatHeader() {
  const { conversations, selectedConversationId } = useChat();
  const currConversation = conversations.find((c) => c.id === selectedConversationId);

  if (!currConversation) {
    return;
  }

  return (
    <div className="flex w-full max-w-full gap-4 items-center border-b bg-white px-6 py-4">
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
            <div className="flex items-center px-2 py-1 gap-1 text-xs text-gray-500 rounded-sm hover:bg-prussian-blue/10 hover:cursor-pointer transition duration-200 ease-in-out">
              <UsersRound className="h-3 w-3" />
              <span>{currConversation.participant_count}</span>
            </div>
          )}
        </div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex-none rounded-full p-2 ml-auto mr-2 hover:cursor-pointer">
            <MoreHorizontal className="text-prussian-blue" size={25} />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-1/2 bg-white dark:bg-black">
          <SheetTitle />
          <SheetDescription />
          <ChatOption currConversation={currConversation} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
