"use client";

import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { DropdownMenu } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import messages from "@/data/messages"
import conversations from "@/data/conversations"
import users from "@/data/users"

export function ChatSidebar({setCurrConv}) {
    const searchParams = useSearchParams();
    const currentId = searchParams.get("userId");

    return (
        <div className="flex flex-col w-90">
            <Separator />
            <div className="p-4">All Message</div>
            <Separator />
            <div className="p-4">
                <Input type="search" placeholder="Search"/>
            </div>
            <Separator />
            <ScrollArea className={"flex-1"}>
                {conversations.filter(conversation => conversation.participantsId.includes(parseInt(currentId))).map(conversation => (
                    <Conversation key={conversation.id} currentConv={conversation} currentUserId={currentId} setCurrConv={setCurrConv}/>
                ))}
            </ScrollArea>
        </div>
    )
}
function Conversation( { currentConv, currentUserId, setCurrConv } ){
    const lastMessage = messages.find(message => message.id === currentConv.messagesId[currentConv.messagesId.length - 1]);
    const receiverUser = users.find(user => user.id === currentConv.participantsId.find(id => id !== parseInt(currentUserId)));
    
    return (
        <button onClick={() => setCurrConv(currentConv)} className={cn("flex gap-2 p-4 w-90 hover:bg-gray-200")}>
            <Avatar className="flex-none">
                <AvatarImage src={receiverUser.avatar_url} alt="" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 text-left">
                <div className="flex-1 text-xl font-bold">{receiverUser.name}</div>
                <div className="flex-1">{lastMessage.content}</div>
                <div className="flex-1">{new Date(lastMessage.createAt).toLocaleString()}</div>
            </div>
        </button>
    )
}
