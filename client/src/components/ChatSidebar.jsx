/**
 * ChatSidebar component renders a sidebar for displaying conversations and messages.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setCurrConv - Function to set the current conversation.
 * @param {Array} props.conversations - List of conversation objects.
 * @param {Array} props.messages - List of message objects.
 * @param {Array} props.users - List of user objects.
 * @returns {JSX.Element|null} The rendered ChatSidebar component or null if required data is missing.
 */
"use client";

import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function ChatSidebar({ setCurrConv, conversations, messages, users }){
    const searchParams = useSearchParams();
    const currentId = searchParams.get("userId");
    // Only render if conversations, messages, and users are available
    if (conversations.length === 0 || messages.length === 0 || users.length === 0) return null;
    return (
        <div className="flex flex-col w-90">
            <div className="p-4 text-2xl">All Message</div>
            <Separator className="w-15"/>
            <div className="p-4">
                <Input type="search" placeholder="Search"/>
            </div>
            <Separator className="w-15"/>
            <ScrollArea className={"flex-1"}>
                {conversations.filter(conversation => conversation.participants.includes(currentId)).map(conversation => (
                    <Conversation key={conversation.id} 
                                  conversation={conversation}
                                  currentUserId={currentId} 
                                  setCurrConv={setCurrConv} 
                                  messages={messages} 
                                  users={users}/>
                ))}
            </ScrollArea>
        </div>
    )
}
function Conversation({ conversation, currentUserId, setCurrConv, messages, users }){
    const lastUpdate = new Date(conversation.updatedAt);
    const lastMessage = messages.find(message => new Date(message.createdAt).valueOf() === lastUpdate.valueOf());
    const receiverUsers = conversation.participants.filter(id => id !== currentUserId).map(id => users.find(user => user.id === id));
    return (
        <button onClick={() => setCurrConv(conversation)} className={cn("flex gap-2 p-4 w-90 hover:bg-gray-400")}>
            <Avatar className="flex-none">
                <AvatarImage src={receiverUsers[0].avatar_url} alt="" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 text-left">
                <div className="flex-1 text-xl font-bold">{receiverUsers[0].fullname}</div>
                <div className="flex-1">{lastMessage && lastMessage.content}</div>
                <div className="flex-1">{new Intl.DateTimeFormat("en-GB", {dateStyle: "short", timeStyle: "short"}).format(lastUpdate)}</div>
            </div>
        </button>
    )
}
