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
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

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
            <Card className="flex-1 my-2 min-h-0 bg-amber-100 overflow-hidden">
                <CardContent className="h-full p-2">
                    <ScrollArea className="h-full w-full overflow-auto">
                        <div className="flex flex-col p-2">
                            {conversationMessages.map(message => {
                                if (!message) return null;
                                const sender = users.find(user => user.id === message.senderId);
                                if (!sender) return null;
                                // Check if the previous message is from the same sender and on the same date
                                const prevMessage = conversationMessages[conversationMessages.indexOf(message) - 1];
                                const prevIsSameSender = prevMessage && prevMessage.senderId === message.senderId;
                                const prevIsSameDate = prevMessage && new Date(prevMessage.createdAt).toDateString() === new Date(message.createdAt).toDateString();
                                // Check if the next message is from the same sender and on the same date
                                const nextMessage = conversationMessages[conversationMessages.indexOf(message) + 1];
                                const nextIsSameSender = nextMessage && nextMessage.senderId === message.senderId;
                                const nextIsSameDate = nextMessage && new Date(nextMessage.createdAt).toDateString() === new Date(message.createdAt).toDateString();
                                return (
                                    <div key={message.id}>
                                        {(!prevIsSameDate) ? (
                                            <div className="w-full py-2 text-sm text-gray-500 text-center">{new Date(message.createdAt).toLocaleDateString()}</div>
                                        ) : null}
                                        <div className={cn("flex py-2 gap-2", 
                                            sender.id === currUser ? "justify-end" : "justify-start")}>
                                            <div className={cn("flex mx-2 gap-2", sender.id !== currUser ? "flex-row" : "flex-row-reverse")}>
                                                {(message.senderId !== currUser && !prevIsSameSender) ? (
                                                    <Avatar className="flex-none">
                                                        <AvatarImage src={sender.avatar_url ? sender.avatar_url : null} alt="" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                ) : <div className="flex-none w-8"></div>}
                                                <div className={cn("flex items-center p-3 w-fit max-w-xs h-fit rounded-md bg-amber-300", 
                                                    sender.id === currUser ? "text-right" : "text-left")}>
                                                    {message.content}
                                                </div>
                                                {(!nextIsSameSender || (nextIsSameSender && !nextIsSameDate))? (
                                                    <div className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={chatContainerRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            <ChatInput mess={mess} setMess={setMess} sendMessageHandler={sendMessageHandler} handleKeyPress={handleKeyPress} loading={loading} />
        </div>
    );
}