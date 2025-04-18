"use client";

import { ChatSidebar } from '@/components/ChatComponents/ChatSidebar';
import { useEffect } from 'react';
import { useChatData } from '@/hooks/use-chatdata';

export default function DefaultMessages() {
    const { 
      conversations, 
      messages, 
      users, 
      currConv, 
      setCurrConv, 
      searchText, 
      setSearchText, 
      convContainerRef,
      setObservedMessage,
      currentUserId
    } = useChatData();
    // Reset currConv and searchText when the component mounts
    useEffect(() => {
        setCurrConv(null);
        setSearchText("");
        setObservedMessage([]); // Reset observed messages
    }, []);
    // Fallback UI when no conversation is selected
    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex-none w-fit min-w-80 overflow-hidden">
                <ChatSidebar 
                    currentUserId={currentUserId} 
                    currConv={currConv} 
                    setCurrConv={setCurrConv} 
                    conversations={conversations} 
                    messages={messages} 
                    users={users} 
                    searchText={searchText} 
                    setSearchText={setSearchText} 
                    convContainerRef={convContainerRef}
                />
            </div>
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to start messaging.</p>
            </div>
        </div>
    );
}