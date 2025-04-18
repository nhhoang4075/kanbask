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
import { Separator } from "../ui/separator"
import SearchChatSidebar from "./SearchChatSidebar";
import Conversation from "./Conversation";

export function ChatSidebar({ currentUserId, currConv, setCurrConv, conversations, searchText, setSearchText, convContainerRef }) {
    // Filter out the current user from the list of users
    //const searchUsers = users.filter(user => user.id !== currentUserId).filter(user => user.fullname.toLowerCase().startsWith(searchText.toLowerCase()));
    // Only render if conversations, messages, and users are available else render this
    if (!conversations?.length) {
        return (
            <div className="flex flex-col h-full w-full pl-2">
                <div className="py-4 px-3 text-2xl font-bold">All Messages</div>
                <Separator className="bg-black dark:bg-white"/>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">No conversations available</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col h-full w-full pl-2">
            <div className="py-4 px-3 text-2xl font-bold">All Messages</div>
            <Separator className="bg-black dark:bg-white"/>
            <div className="flex flex-col p-4 relative">
                <Input 
                    type="search" 
                    placeholder="Search users" 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                />
                {(searchText && searchUsers.length) ? (
                    <SearchChatSidebar
                        searchUsers={searchUsers}
                        conversations={conversations}
                        setCurrConv={setCurrConv}
                        setSearchText={setSearchText}
                    />
                ) : null}
            </div>
            <Separator className="bg-black dark:bg-white mb-2"/>
            <ScrollArea className="flex-1 overflow-auto" >
                <div ref={convContainerRef}></div>
                <div className="flex flex-col gap-2 pr-2">
                    {conversations
                        .map(conversation => (
                            <Conversation 
                                key={conversation.id} 
                                conversation={conversation}
                                currentUserId={currentUserId} 
                                currConv={currConv}
                                setCurrConv={setCurrConv} 
                            />
                        ))
                    }
                </div>
            </ScrollArea>
        </div>
    )
}

