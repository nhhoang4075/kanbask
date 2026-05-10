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

<<<<<<< HEAD
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export function ChatSidebar({ setCurrConv, conversations, messages, users }){
    const searchParams = useSearchParams();
    const currentId = searchParams.get("userId");

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
            <div className="flex p-4">
                <Input type="search" placeholder="Search conversations" className="flex-1"/>
                <Button variant="outline" className="flex-none ml-2 hover:bg-gray-400" onClick={() => {}}>
                    <Plus />
                </Button>
            </div>
            <Separator className="bg-black dark:bg-white"/>
            <ScrollArea className="flex-1 overflow-auto">
                {conversations
                    .filter(conversation => conversation?.participants?.includes(currentId))
                    .map(conversation => (
                        <Conversation 
                            key={conversation.id} 
                            conversation={conversation}
                            currentUserId={currentId} 
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
=======
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { DropdownMenu } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import messages from "@/data/messages";
import conversations from "@/data/conversations";
import users from "@/data/users";

export function ChatSidebar({ setCurrConv }) {
  const searchParams = useSearchParams();
  const currentId = searchParams.get("userId");

  return (
    <div className="flex flex-col w-90">
      <Separator />
      <div className="p-4">All Message</div>
      <Separator />
      <div className="p-4">
        <Input type="search" placeholder="Search" />
      </div>
      <Separator />
      <ScrollArea className={"flex-1"}>
        {conversations
          .filter((conversation) =>
            conversation.participantsId.includes(parseInt(currentId))
          )
          .map((conversation) => (
            <Conversation
              key={conversation.id}
              currentConv={conversation}
              currentUserId={currentId}
              setCurrConv={setCurrConv}
            />
          ))}
      </ScrollArea>
    </div>
  );
}
function Conversation({ currentConv, currentUserId, setCurrConv }) {
  const lastMessage = messages.find(
    (message) =>
      message.id === currentConv.messagesId[currentConv.messagesId.length - 1]
  );
  const receiverUser = users.find(
    (user) =>
      user.id ===
      currentConv.participantsId.find((id) => id !== parseInt(currentUserId))
  );

  return (
    <button
      onClick={() => setCurrConv(currentConv)}
      className={cn("flex gap-2 p-4 w-90 hover:bg-gray-200")}
    >
      <Avatar className="flex-none">
        <AvatarImage src={receiverUser.avatar_url} alt="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 text-left">
        <div className="flex-1 text-xl font-bold">{receiverUser.name}</div>
        <div className="flex-1">{lastMessage.content}</div>
        <div className="flex-1">
          {new Date(lastMessage.createAt).toLocaleString()}
        </div>
      </div>
    </button>
  );
>>>>>>> origin/server/core-v1.0.0
}
