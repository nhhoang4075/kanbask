/**
 * ChatSidebar component renders a sidebar for displaying conversations and messages.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setCurrConv - Function to set the current conversation.
 * @param {Array} props.conversations - List of conversation objects.
 * @param {Array} props.messages - List of message objects.
 * @param {Array} props.users - List of user objects.
 * @returns {JSX.Element} The rendered ChatSidebar component.
 */
"use client";

import { ScrollArea } from "../ui/scroll-area"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"

export function ChatSidebar({ currentId, currConv, setCurrConv, conversations, messages, users, searchText, setSearchText, convContainerRef }) {
    const searchUsers = users.filter(user => user.id !== currentId).filter(user => user.fullname.toLowerCase().startsWith(searchText.toLowerCase()));
    // Only render if conversations, messages, and users are available else render this
    if (!conversations?.length || !messages?.length || !users?.length) {
        return (
            <div className="flex flex-col h-full">
                <div className="p-4 text-2xl">All Message</div>
                <Separator className="bg-black dark:bg-white"/>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">No conversations available</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 text-2xl">All Messages</div>
            <Separator className="bg-black dark:bg-white"/>
            <div className="flex flex-col p-4 relative">
                <Input 
                    type="search" 
                    placeholder="Search users" 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                />
                {(searchText && searchUsers.length) ? (
                    <div 
                        className="absolute top-full left-0 right-0 z-50 flex flex-col gap-2 mt-2 h-fit max-h-60 overflow-auto bg-white shadow-lg border border-gray-300"
                    >
                        {searchUsers.map(user => (
                            <button 
                                key={user.id} 
                                onClick={() => {
                                    // Check if a conversation already exists with the user
                                    const existingConv = conversations.find(conv => conv.participants.includes(user.id));
                                    if (existingConv && existingConv.participants.length <= 2) {
                                        setCurrConv(existingConv);
                                    } else {
                                        // If no conversation found, create a new temporary one
                                        const newTempConv = {
                                            id: "conv-temp", //set a temporary ID
                                            teamId: "",
                                            projectId: "",
                                            participants: [currentId, user.id],
                                            messageIds: [],
                                            createdAt: new Date().toISOString(),
                                            updatedAt: "",
                                        };
                                        setCurrConv(newTempConv);
                                    }
                                    setSearchText("");
                                }}
                                className="flex gap-2 p-4 hover:bg-gray-400"
                            >
                                <Avatar className="flex-none h-5 w-5">
                                    <AvatarImage src={user.avatar_url ? user.avatar_url : null} alt="" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left">
                                    <div className="font-bold">{user.fullname}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
            <Separator className="bg-black dark:bg-white"/>
            <ScrollArea className="flex-1 overflow-auto" >
                <div ref={convContainerRef}></div>
                {conversations
                    .filter(conversation => conversation?.participants?.includes(currentId))
                    .map(conversation => (
                        <Conversation 
                            key={conversation.id} 
                            conversation={conversation}
                            currentUserId={currentId} 
                            currConv={currConv}
                            setCurrConv={setCurrConv} 
                            messages={messages} 
                            users={users}
                        />
                    ))
                }
            </ScrollArea>
        </div>
    )
}

function Conversation({ conversation, currentUserId, currConv, setCurrConv, messages, users }) {
    const lastUpdate = new Date(conversation.updatedAt);
    // Find the last message in the conversation
    const lastMessage = lastUpdate
        ? messages.find(message => new Date(message.createdAt).valueOf() === lastUpdate.valueOf())
        : null;
    // Get the receiver user(s) for the current conversation
    const receiverUsers = conversation.participants
        .filter(id => id !== currentUserId)
        .map(id => users.find(user => user.id === id));
    return (
        <button onClick={() => setCurrConv(conversation)} className={cn("flex gap-2 p-4 w-90 hover:bg-gray-400", conversation?.id === currConv?.id && "bg-gray-400")}>
            <Avatar className="flex-none">
                <AvatarImage src={receiverUsers.length == 1 ? receiverUsers[0]?.avatar_url : null} alt="" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 text-left">
                <div className="flex-1 text-xl font-bold">
                    {receiverUsers.length === 1 ? receiverUsers[0]?.fullname : conversation.title}
                </div>
                <div className="flex-1">{lastMessage?.content || "No messages yet"}</div>
                <div className="flex-1">
                    {lastUpdate
                        ? new Intl.DateTimeFormat("en-GB", {
                              dateStyle: "short",
                              timeStyle: "short",
                          }).format(lastUpdate)
                        : "No date available"}
                </div>
            </div>
        </button>
    );
}
