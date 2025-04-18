"use client";

import { ChatSidebar } from '@/components/ChatComponents/ChatSidebar';
import { Chat } from '@/components/ChatComponents/Chat';
import { useState, useEffect, use } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { useChatData } from '@/hooks/use-chatdata';
export default function Messages({ params }) {

    const { 
        conversations, 
        setConversations, 
        currConv, 
        setCurrConv, 
        searchText, 
        setSearchText, 
        convContainerRef,
        currentUserId, 
        conversationMessages,
        setConversationMessages,
    } = useChatData();
    const [loading, setLoading] = useState(false);
    const { socket } = useSocket();
    const { conversationId } = use(params); // use Use hook to get promises

    useEffect(() => {
        // Automatically select the conversation based on the conversationId from the route
        const selectedConv = conversations?.find(conv => conv.id === conversationId);
        setCurrConv(selectedConv);
        console.log("Selected conversation:", selectedConv);
    }, [conversations, conversationId]);
    
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
            const updatedMessages = [
                ...conversationMessages, newmess]
            setConversationMessages(updatedMessages);
            if (!isTemp) {
                // Update the conversation if it already exists
                const updatedConversations = conversations.map((conv) => {
                    if (conv.id === newmess.conversation_id) {
                        return {
                            ...conv,
                            latest_message_at: newmess.createdAt,
                        };
                    }
                    return conv;
                });
                // Sort conversations by updatedAt in descending order
                updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setConversations(updatedConversations);
                // Update the current conversation if it matches
                if (workConv && workConv.id === newmess.conversation_id) {
                    setCurrConv({
                        ...workConv,
                        latest_message_at: newmess.createdAt,
                    });
                }
            } else {
                // Handle temporary conversation creation
                setConversations([workConv, ...conversations]);
                setCurrConv(workConv);
            }
            // // Send the message to the server
            // await sendMessage({ message: newmess });
            // if (isTemp) {
            //     await addConversation(workConv);
            // } else {
            //     await updateConversation({
            //         conversation_id: newmess.conversation_id,
            //         messageId: newmess.id,
            //         timeSent: newmess.createdAt,
            //         command: "add"
            //     });
            // }
            // Emit the new message to other clients
            if (socket) {
                socket.emit("send-message", {conversation_id: conversationId, sender_id: currentUserId, content: newmess.content});
            }
        };

        try {
            setLoading(true);
            // Handle the case when the current conversation is temporary
            if (newMessage.conversation_id === "conv-temp") {
                // Fix the new message conversation ID
                const newFixedMessage = {
                    ...newMessage,
                    conversation_id: `conv-${Date.now()}`, // Generate a unique ID
                };
                // Create a new conversation object
                const newConv = {
                    ...currConv,
                    id: newFixedMessage.conversation_id,
                    createdAt: newFixedMessage.createdAt,
                    latest_message_at: newFixedMessage.createdAt,
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
    // const handleSeenMessage = async (messageId) => {
    //     const message = conversationMessages.find((msg) => msg.id === messageId);
    //     if (message?.status === "received" && message.senderId !== currentUserId) {
    //         const updatedMessages = conversationMessages.map((message) => {
    //             if (message.id === messageId) {
    //                 return { ...message, status: "read" };
    //             }
    //             return message;
    //         });
    //         // Update the server with the new status first
    //         const result = await updateMessages({ messageIds: [messageId], changes: { status: "read" } });
    //         if (result.status !== 201) {
    //             console.error("Error updating messages:", result);
    //         } else setConversationMessages(updatedMessages);
    //         // Emit the updated message to other clients
    //         if (result.status === 201 && socket) {
    //             socket.emit("update-message", { messageId: messageId, changes: { status: "read" }, conversation_id: currConv.id });
    //         }
    //     }
    // }
    // Change the message status to deleted when the user unsends it. The message will truely be deleted from the server when the user refreshes the page.
    // This is to prevent the user from deleting the message and it being deleted from the server immediately.
    // const handleDeleteMessage = async (messageId) => {
    //     const deletedMessage = conversationMessages.find((msg) => msg.id === messageId);
    //     if (!deletedMessage) return;
    //     const updatedMessages = conversationMessages.map((message) => {
    //         if (message.id === messageId) {
    //             return { ...message, status: "deleted" };
    //         }
    //         return message;
    //     });
    //     const result = await updateMessages({ messageIds: [messageId], changes: { status: "deleted" } });
    //     if (result.status !== 201) {
    //         console.error("Error deleting messages:", result);
    //     } else {
    //         // Emit the deleted message IDs to other clients
    //         setConversationMessages(updatedMessages);
    //         if (socket) {
    //             socket.emit("update-message", { messageId: messageId, changes: { status: "deleted" }, conversation_id: currConv.id });
    //         }
    //     }
    //     // Update the current conversation to remove the deleted message ID
    // }
    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex-none w-fit min-w-80 overflow-hidden">
                <ChatSidebar 
                    currentUserId={currentUserId}
                    currConv={currConv}
                    setCurrConv={setCurrConv} 
                    conversations={conversations} 
                    searchText={searchText}
                    setSearchText={setSearchText}
                    convContainerRef={convContainerRef}
                />
            </div>
            {/* <Separator orientation="vertical" className="flex-none w-0.5 bg-black dark:bg-white"/> */}
            <div className="flex-1 overflow-hidden">
                <Chat 
                    currentUserId={currentUserId}
                    currConv={currConv} 
                    conversationMessages={conversationMessages}
                    handleSendMessage={handleSendMessage}
                    // handleSeenMessage={handleSeenMessage}
                    // handleDeleteMessage={handleDeleteMessage}
                    loading={loading}
                />
            </div>
        </div>
    )
}