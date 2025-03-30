/**
 * Chat component for rendering a chat interface with messages, input, and user details.
 *
 * @param {Object} props - The properties passed to the Chat component.
 * @param {Object} props.currConv - The current conversation object.
 * @param {Array} props.messages - Array of message objects.
 * @param {Array} props.users - Array of user objects.
 * @param {Function} props.handleSendMessage - Function to handle sending a message.
 * @param {boolean} props.loading - Indicates if a message is currently being sent.
 *
 * @returns {JSX.Element|null} The rendered Chat component or null if no conversation is selected.
 */
"use client";

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function Chat({ currConv, messages, users, handleSendMessage, loading }) {
    const searchParams = useSearchParams();
    const currUser = searchParams.get("userId");
    const chatContainerRef = useRef(null);
    const [mess, setMess] = useState("");
    
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
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

    // Get the receiver user(s) for the current conversation
    const receiverUsers = currConv.participants
        .filter(id => id !== currUser)
        .map(id => users.find(user => user.id === id));
        
    // Get messages for current conversation, including newly added ones
    const conversationMessages = currConv.messageIds
        .map(messageId => messages.find(message => message.id === messageId))
        .filter(Boolean); // Filter out any undefined messages
        
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Card className="flex-none bg-amber-100 py-4">
                <CardContent className="flex w-full gap-3">
                    <Avatar className="flex-none size-10">
                        <AvatarImage src={receiverUsers[0]?.avatar_url} alt=""/>
                        <AvatarFallback>{receiverUsers[0]?.fullname?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-3xl font-bold">
                        {receiverUsers[0]?.fullname}
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-1 my-2 min-h-0 bg-amber-100 overflow-hidden">
                <CardContent className="h-full p-2">
                    <ScrollArea className="h-full w-full overflow-auto">
                        <div className="flex flex-col p-2">
                            {conversationMessages.map(message => {
                                if (!message) return null;
                                const sender = users.find(user => user.id === message.senderId);
                                if (!sender) return null;
                                return (
                                    <div key={message.id} className={cn("flex py-2 gap-2", 
                                        sender.id === currUser ? "justify-end" : "justify-start")}>
                                        <div className="flex mx-2 gap-2">
                                            {message.senderId !== currUser && (
                                                <Avatar className="flex-none">
                                                    <AvatarImage src={sender.avatar_url} alt="" />
                                                    <AvatarFallback>{sender.fullname?.[0] || 'U'}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn("flex items-center p-3 w-fit max-w-xs h-fit rounded-md bg-amber-300", 
                                                sender.id === currUser ? "text-right" : "text-left")}>
                                                {message.content}
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
            <div className="flex-none flex items-center gap-2 p-1">
                <Input 
                    type="text" 
                    placeholder="Type a message" 
                    className="flex-1" 
                    value={mess}
                    onChange={(e) => setMess(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                />
                <Button 
                    className="flex-none" 
                    onClick={sendMessageHandler}
                    disabled={loading || !mess.trim()}
                >
                    {loading ? 'Sending...' : 'Send'}
                </Button>
            </div>
        </div>
    );
}