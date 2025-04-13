"use client";

import { ChatSidebar } from '@/components/ChatSidebar';
import { Separator } from "@/components/ui/separator";
import { Chat } from '@/components/Chat';
import { useState, useEffect } from 'react';
import { getConversations, getMessages, getUsers, sendMessage, updateConversation, addConversation } from '@/lib/ServerActions';

export default function Message() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [currConv, setCurrConv] = useState(null);
    const [loading, setLoading] = useState(false);

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
    // Pass function to update local state when conversation changes
    const handleSendMessage = async (newMessage) => {
        try {
            // Set the loading state to true
            setLoading(true);
            // First update local state to provide immediate feedback
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            // Update conversations before sending to prevent race condition
            const updatedConversations = conversations.map(conv => {
                if (conv.id === newMessage.conversationId) {
                    return {
                        ...conv,
                        messageIds: [...conv.messageIds, newMessage.id],
                        updatedAt: newMessage.createdAt
                    };
                }
                return conv;
            });
            setConversations(updatedConversations);
            // Find and update current conversation if it matches
            if (currConv && currConv.id === newMessage.conversationId) {
                setCurrConv({
                    ...currConv,
                    messageIds: [...currConv.messageIds, newMessage.id],
                    updatedAt: newMessage.createdAt
                });
            }
            // Send to server
            await sendMessage({ message: newMessage });
            await updateConversation({ 
                conversationId: newMessage.conversationId, 
                messageId: newMessage.id, 
                timeSent: newMessage.createdAt 
            });
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };
    // Pass function to add a new conversation
    const addConv = async () => {
        const newConv = {
            id: `conv-${Date.now()}`, // Unique ID based on timestamp
            participants: [users[0].id], // Assuming the first user is the sender
            messageIds: [],
            updatedAt: new Date().toISOString()
        };
        setConversations([...conversations, newConv]);
        setCurrConv(newConv);
        await addConversation(newConv);
        // Optionally, you can also fetch the updated conversations list here
        // const updatedConversations = await getConversations();
        // setConversations(updatedConversations);
    };
    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex-none w-90 overflow-hidden">
                <ChatSidebar 
                    setCurrConv={setCurrConv} 
                    conversations={conversations} 
                    messages={messages} 
                    users={users}
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