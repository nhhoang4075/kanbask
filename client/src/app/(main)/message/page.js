"use client";

import { ChatSidebar } from '@/components/ChatSidebar';
import { Separator } from "@/components/ui/separator";
import { Chat } from '@/components/Chat';
import { useState, useEffect, useRef } from 'react';
import { getConversations, getMessages, getUsers, sendMessage, updateConversation, addConversation } from '@/lib/ServerActions';

export default function Message() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [currConv, setCurrConv] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const convContainerRef = useRef(null);

    useEffect(() => {
        // Use Promise.all to fetch all data at once
        // This will make the code cleaner and more efficient
        Promise.all([
            getConversations(),
            getMessages(),
            getUsers()
        ]).then(([conversations, messages, users]) => {
            setConversations(conversations);
            setMessages(messages);
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
                Update(newConv, newFixedMessage, true);
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

    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex-none w-90 overflow-hidden">
                <ChatSidebar 
                    setCurrConv={setCurrConv} 
                    conversations={conversations} 
                    messages={messages} 
                    users={users}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    convContainerRef={convContainerRef}
                />
            </div>
            <Separator orientation="vertical" className="flex-none w-0.5 bg-black dark:bg-white"/>
            <div className="flex-1 overflow-hidden">
                <Chat 
                    currConv={currConv} 
                    conversations={conversations} 
                    messages={messages} 
                    users={users}
                    handleSendMessage={handleSendMessage}
                    loading={loading}
                />
            </div>
        </div>
    )
}