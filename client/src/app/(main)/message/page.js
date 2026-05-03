"use client";

import { ChatSidebar } from '@/components/ChatComponents/ChatSidebar';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useChatData } from '@/hooks/use-chatdata';
import { useSocket } from '@/hooks/use-socket';
import { updateMessages } from '@/lib/MessageActions';

export default function DefaultMessages() {
    const { 
      conversations, 
      setConversations,
      messages, 
      setMessages,
      users, 
      currConv, 
      setCurrConv, 
      searchText, 
      setSearchText, 
      convContainerRef,
      setObservedMessage
    } = useChatData();
    const { socket, isConnected } = useSocket();
    const searchParams = useSearchParams();
    const currentId = searchParams.get("userId");
    // Reset currConv and searchText when the component mounts
    useEffect(() => {
        setCurrConv(null);
        setSearchText("");
        setObservedMessage([]); // Reset observed messages
    }, []);
    useEffect(() => {
        if (!isConnected || !socket) return;
        // Handle socket events
        socket.on("received-message", async (message) => {
            // Check if the message is from another user and update its status
            if (message.senderId !== currentId && message.status === "sent") {
                message.status = "received";
                await updateMessages({ messagesId: [message.id], changes: { status: "received" } });
                if (socket){
                    socket.emit("update-message", { messageId: message.id, changes: { status: "received" }, conversationId: message.conversationId });
                }
            }
            setMessages((prevMessages) => [...prevMessages, message]);
            // Update the conversation if it already exists
            const updatedConversations = conversations.map((conv) => {
                if (conv.id === message.conversationId) {
                    return {
                        ...conv,
                        messageIds: [...conv.messageIds, message.id],
                        updatedAt: message.createdAt,
                    };
                }
                return conv;
            }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setConversations(updatedConversations);
            // Update the current conversation if it matches
            if (currConv && currConv.id === message.conversationId) {
                setCurrConv({
                    ...currConv,
                    messageIds: [...currConv.messageIds, message.id],
                    updatedAt: message.createdAt,
                });
            }
        });
        // Update the message when it is updated from another client
        socket.on("updated-message", ({ messageId, changes }) => {           
            setMessages((prevMessages) => prevMessages.map((message) => {
                if (message.id === messageId) {
                    return { ...message, ...changes };
                }
                return message;
            }));
        });

        return () => {
            socket.off("received-message");
            socket.off("updated-message");
        }
    }, [socket, currConv, currentId, conversations]);
    // Fallback UI when no conversation is selected
    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex-none w-fit min-w-80 overflow-hidden">
                <ChatSidebar 
                    currentId={currentId} 
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