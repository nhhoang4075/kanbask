/**
 * Chat component for rendering a chat interface with messages, input, and user details.
 *
 * @param {Object} props - The properties passed to the Chat component.
 * @param {Object} props.currConv - The current conversation object, containing details like participants and message IDs.
 * @param {Array} props.messages - Array of message objects, each containing details like sender, content, and timestamps.
 * @param {Array} props.users - Array of user objects, each containing user details like ID, name, and avatar URL.
 * @param {Function} props.handleSendMessage - Function to handle sending a new message. It accepts a message object as an argument.
 * @param {boolean} props.loading - Indicates whether a message is currently being sent, disabling input and send button.
 *
 * @returns {JSX.Element} The rendered Chat component, displaying the chat interface, or a placeholder if no conversation is selected.
 */
"use client";

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Message from "./Message";

export function Chat({ currConv, messages, users, handleSendMessage, loading }) {
    const searchParams = useSearchParams();
    const currUser = searchParams.get("userId");
    const chatContainerRef = useRef(null);
    const [mess, setMess] = useState("");
    
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ block: "end" });
        }
    }
    // Scroll to bottom when messages or current conversation changes
    useEffect(() => {
        if (currConv) { // Only scroll if we have a conversation
            scrollToBottom();
        }
    }, [currConv, messages]);
    // Handle Enter key press for sending messages
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageHandler();
        }
    };
    // Handle sending message
    const sendMessageHandler = async () => {
        if (!mess || mess.trim() === "" || !currConv) return;
        const timeSent = new Date();
        const newMessage = {
            id: `msg-${timeSent.getTime()}`, // Time unique ID to prevent collisions
            conversationId: currConv.id,
            senderId: currUser,
            content: mess.trim(),
            status: "sent",
            createdAt: timeSent.toISOString(),
        };
        // Clear input first for better UX
        setMess("");
        await handleSendMessage(newMessage);
    }
    // Early return after all hooks have been called
    if (!currConv) {
        return (
            <div className="flex flex-col h-full flex-3/5 p-2 items-center justify-center">
                <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
        );
    }
    // Get messages for current conversation, including newly added ones
    const conversationMessages = currConv.messageIds
        .map(messageId => messages.find(message => message.id === messageId))     
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ChatHeader currUser={currUser} currConv={currConv} users={users} />
            <Card className="flex-1 my-2 min-h-0 bg-neutral-100 dark:bg-black overflow-hidden">
                <CardContent className="h-full p-2">
                    <ScrollArea className="h-full w-full overflow-auto">
                        <div className="flex flex-col p-2">
                            {conversationMessages.map(message => (
                                <Message 
                                    key={message.id} 
                                    message={message} 
                                    users={users} 
                                    conversationMessages={conversationMessages} 
                                    currUser={currUser} 
                                />
                            ))}
                            <div ref={chatContainerRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <ChatInput mess={mess} setMess={setMess} sendMessageHandler={sendMessageHandler} handleKeyPress={handleKeyPress} loading={loading} />
        </div>
    );
}