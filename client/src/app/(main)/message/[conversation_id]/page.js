"use client";

import { ChatSidebar } from '@/components/ChatComponents/ChatSidebar';
import { Chat } from '@/components/ChatComponents/Chat';
import { useState, useEffect, use, useRef } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { useChatData } from '@/hooks/use-chatdata';

export default function Messages({ params }) {
    const { 
        conversations, 
        setConversations, 
        messages,
        setMessages,
        currConv, 
        setCurrConv, 
        searchText, 
        setSearchText, 
        convContainerRef,
        currentUserId,
        allParticipants,
    } = useChatData();
    const [loading, setLoading] = useState(false);
    const { socket } = useSocket();
    const { conversationId } = use(params); // use Use hook to get promises

    useEffect(() => {
        if (!conversations?.length || !conversationId) return;
        const selectedConv = conversations.find(conv => conv.id === conversationId);
        if (selectedConv && (!currConv || currConv.id !== conversationId)) {
            setCurrConv(selectedConv);
            console.log("Selected conversation:", selectedConv);
        }
    }, [conversations, conversationId, currConv, setCurrConv]);
    
    // Handle socket events
    useEffect(() => {
        if (!socket || !currConv) return;
        
        const handleNewMessage = (data) => {
            if (data.conversation_id === currConv.id) {
                setMessages(prev => [...prev, data]);
            }
        };
        
        socket.on('new-message', handleNewMessage);
        
        return () => {
            socket.off('new-message', handleNewMessage);
        };
    }, [socket, currConv, setMessages]);
    
    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        if (convContainerRef.current) {
            convContainerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };
    
    // Handle sending messages
    const handleSendMessage = async (newMessage) => {
        try {
            setLoading(true);
            
            // If it's a new conversation
            if (newMessage.conversation_id === "conv-temp") {
                // Create a new conversation with unique ID
                const newConvId = `conv-${Date.now()}`;
                const newFixedMessage = {
                    ...newMessage,
                    conversation_id: newConvId
                };
                
                // Create new conversation object
                const newConv = {
                    ...currConv,
                    id: newConvId,
                    createdAt: newMessage.createdAt,
                    updatedAt: newMessage.createdAt,
                };
                
                // Update local state immediately
                setMessages([newFixedMessage]);
                setConversations(prev => [newConv, ...prev]);
                setCurrConv(newConv);
                
                // // Send to server
                // await addConversation(newConv);
                // await sendMessage({ message: newFixedMessage });
                
            } else {
                // Update existing conversation
                
                // Update local state immediately
                setMessages(prev => [...prev, newMessage]);
                
                // Update conversations list (move this conversation to top)
                const updatedConversations = conversations.map(conv => {
                    if (conv.id === newMessage.conversation_id) {
                        return {
                            ...conv,
                            updatedAt: newMessage.createdAt
                        };
                    }
                    return conv;
                });
                
                // Sort by updated time
                updatedConversations.sort((a, b) => 
                    new Date(b.updatedAt) - new Date(a.updatedAt)
                );
                
                setConversations(updatedConversations);
                
                // // Send to server
                // await sendMessage({ message: newMessage });
                // await updateConversation({
                //     conversationId: newMessage.conversation_id,
                //     messageId: newMessage.id,
                //     timeSent: newMessage.createdAt,
                //     command: "add"
                // });
                
                // // Emit via socket if available
                // if (socket) {
                //     socket.emit("send-message", newMessage);
                // }
            }
            
            // Scroll to bottom after sending
            setTimeout(scrollToBottom, 100);
            
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex-none w-fit min-w-80 overflow-hidden">
                <ChatSidebar 
                    currentUserId={currentUserId}
                    currConv={currConv}
                    setCurrConv={setCurrConv} 
                    searchText={searchText}
                    setSearchText={setSearchText}
                    convContainerRef={convContainerRef}
                />
            </div>
            <div className="flex-1 overflow-hidden">
                <Chat 
                    currentUserId={currentUserId}
                    currConv={currConv} 
                    handleSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
}