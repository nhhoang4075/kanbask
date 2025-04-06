"use client";

import { ChatSidebar } from '@/components/ChatComponents/ChatSidebar';
import { Chat } from '@/components/ChatComponents/Chat';
import { useState, useEffect, useRef, use } from 'react';
import { updateConversation, addConversation } from '@/lib/ConversationActions';
import { sendMessage, updateMessages } from '@/lib/MessageActions';
import { useSearchParams } from 'next/navigation';
import { useSocket } from '@/hooks/use-socket';
import { useChatData } from '@/hooks/use-chatdata';
export default function Messages({ params }) {

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
        convContainerRef 
    } = useChatData();
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const currentId = searchParams.get("userId");
    const { socket, isConnected } = useSocket();
    const { conversation_id } = use(params);

    useEffect(() => {
        // Automatically select the conversation based on the conversation_id from the route
        const selectedConv = conversations.find(conv => conv.id === conversation_id);
        setCurrConv(selectedConv);
    }, [conversations, conversation_id]);
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
            // Emit the new message to other clients
            if (socket) {
                socket.emit("new-message", newmess);
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
            // Reset loading state after a delay
            // This is to ensure the loading state is reset after the message is sent
            setTimeout(() => setLoading(false), 2000);
            ScrollToTop();
        }
    };
    // Handle the case when a message is seen
    const handleSeenMessage = async (messageId) => {
        const message = messages.find((msg) => msg.id === messageId);
        if (message?.status === "received" && message.senderId !== currentId) {
            const updatedMessages = messages.map((message) => {
                if (message.id === messageId) {
                    return { ...message, status: "read" };
                }
                return message;
            });
            // Update the server with the new status first
            const result = await updateMessages({ messagesId: [messageId], changes: { status: "read" } });
            if (result.status !== 201) {
                console.error("Error updating messages:", result.error);
            } else setMessages(updatedMessages);
            // Emit the updated message to other clients
            if (result.status === 201 && socket) {
                socket.emit("update-message", { messageId, changes: { status: "read" }, conversationId: currConv.id });
            }
        }
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