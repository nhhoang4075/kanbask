"use client";

import { ChatSidebar } from '@/components/ChatComponents/ChatSidebar';
import { Separator } from "@/components/ui/separator";
import { Chat } from '@/components/ChatComponents/Chat';
import { useState, useEffect, useRef } from 'react';
import { getConversations, updateConversation, addConversation } from '@/lib/ConversationActions';
import { getMessages, sendMessage, updateMesssages } from '@/lib/MessageActions';
import { getUsers } from '@/lib/UserActions';
import { useSearchParams } from 'next/navigation';

export default function Message() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [currConv, setCurrConv] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const convContainerRef = useRef(null);
    const searchParams = useSearchParams();
    const currentId = searchParams.get("userId");

    useEffect(() => {
        // Use Promise.all to fetch all data at once
        // This will make the code cleaner and more efficient
        Promise.all([
            getConversations(),
            getMessages(),
            getUsers()
        ]).then(async ([conversations, messages, users]) => {
            const setReceivedMessages = messages.map((message) => {
                // Check if the message is received from another user and update its status
                if (message.senderId !== currentId && message.status === "sent" && conversations.some(conv => conv.participants.includes(currentId) && conv.id === message.conversationId)) {
                    return { ...message, status: "received" };
                } else return message;
            });
            setConversations(conversations);
            const changedMessagesId = setReceivedMessages.filter(message => message.status === "received").map(message => message.id);
            if (changedMessagesId.length > 0) {
                // Update the messages in the server
                const result = await updateMesssages({ messagesId: changedMessagesId, changes: { status: "received" } });
                if (result.status !== 201) {
                    console.error("Error updating messages:", result.error);
                } else setMessages(setReceivedMessages)
            } else setMessages(messages);
            setUsers(users);
        }).catch(error => {
            console.error("Error fetching data:", error);
        });
    }, []);
    // Scroll to the newly created conversation
    const ScrollToTop = () => {
        if (convContainerRef.current) {
            convContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
    // Handle the case when a new message is sent
    const handleSendMessage = (newMessage) => {
        const Update = async (workConv, newmess, isTemp = false) => {
            // Set the new message in the messages state
            const updatedMessages = [...messages, newmess];
            setMessages(updatedMessages);
            if (!isTemp) {
                // Update the conversation if it already exists
                const updatedConversations = conversations.map((conv) => {
                    if (conv.id === newmess.conversationId) {
                        return {
                            ...conv,
                            messageIds: [...conv.messageIds, newmess.id],
                            updatedAt: newmess.createdAt,
                        };
                    }
                    return conv;
                });
                // Sort conversations by updatedAt in descending order
                updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setConversations(updatedConversations);
                // Update the current conversation if it matches
                if (workConv && workConv.id === newmess.conversationId) {
                    setCurrConv({
                        ...workConv,
                        messageIds: [...workConv.messageIds, newmess.id],
                        updatedAt: newmess.createdAt,
                    });
                }
            } else {
                // Handle temporary conversation creation
                setConversations([workConv, ...conversations]);
                setCurrConv(workConv);
            }
            // Send the message to the server
            await sendMessage({ message: newmess });
            if (isTemp) {
                await addConversation(workConv);
            } else {
                await updateConversation({
                    conversationId: newmess.conversationId,
                    messageId: newmess.id,
                    timeSent: newmess.createdAt,
                });
            }
        };

        try {
            setLoading(true);
            // Handle the case when the current conversation is temporary
            if (newMessage.conversationId === "conv-temp") {
                // Fix the new message conversation ID
                const newFixedMessage = {
                    ...newMessage,
                    conversationId: `conv-${Date.now()}`, // Generate a unique ID
                };
                // Create a new conversation object
                const newConv = {
                    ...currConv,
                    id: newFixedMessage.conversationId,
                    messageIds: [newFixedMessage.id],
                    createdAt: newFixedMessage.createdAt,
                    updatedAt: newFixedMessage.createdAt,
                };
                // Update when the conversation is temporary
                Update(newConv, newFixedMessage, isTemp = true);
            } else {
                // Update the existing conversation
                Update(currConv, newMessage);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
            ScrollToTop();
        }
    };
    // Handle the case when a message is seen
    const handleSeenMessage = async (messageId) => {
        const updatedMessages = messages.map((message) => {
            if (message.id === messageId) {
                return { ...message, status: "read" };
            }
            return message;
        });
        // Update the server with the new status first
        const result = await updateMesssages({ messagesId: [messageId], changes: { status: "read" } });
        if (result.status !== 201) {
            console.error("Error updating messages:", result.error);
        } else setMessages(updatedMessages);
    }
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
            {/* <Separator orientation="vertical" className="flex-none w-0.5 bg-black dark:bg-white"/> */}
            <div className="flex-1 overflow-hidden">
                <Chat 
                    currConv={currConv} 
                    conversations={conversations} 
                    messages={messages} 
                    users={users}
                    handleSendMessage={handleSendMessage}
                    handleSeenMessage={handleSeenMessage}
                    loading={loading}
                />
            </div>
        </div>
    )
}