"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "../ui/sheet";
import { useChat } from "@/hooks/use-chat"
import { getInitials } from "@/lib/user-utils"
import { Users, FolderKanban } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ChatOption from "./chat-option"

export default function ChatHeader() {
    const { conversations, selectedConversationId } = useChat();
    const currConv = conversations.find((c) => c.id === selectedConversationId);
    return (
        <div className="flex w-full gap-3 items-center border-b-2 bg-white h-1/9 py-2 px-4">
            <Avatar className="flex-none h-10 w-10">
                <AvatarImage src={currConv?.avatar_url || null} alt=""/>
                <AvatarFallback>
                    {currConv.type === "direct" ? (
                        getInitials(currConv.title)
                    ) : currConv.type === "team" ? (
                        <Users />
                    ) : (
                        <FolderKanban />
                    )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-none font-roboto text-[25px] 3xl font-bold">
                {currConv?.title || 
                    (currConv?.type === "direct" ? 
                        "Direct Message" : (currConv?.type === "team" ?
                             "Team Chat" : "Project Chat"))}
            </div>
            {currConv?.type === "team" && (
                <Badge className="flex-none text-xs rounded-md bg-red-500">
                Team
                </Badge>
            )}
            {currConv?.type === "project" && (
                <Badge className="flex-none text-xs rounded-md bg-blue-500">
                Project
                </Badge>
            )}
            <Sheet>
                <SheetTrigger asChild>
                    <button className="flex-none rounded-full p-2 ml-auto mr-2 hover:cursor-pointer">
                        <MoreHorizontal className="text-prussian-blue" size={25} />
                    </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-1/2 bg-white dark:bg-black">
                    <SheetTitle />
                    <SheetDescription />
                    <ChatOption currConv={currConv}/>
                </SheetContent>
            </Sheet>
        </div>
    )
}