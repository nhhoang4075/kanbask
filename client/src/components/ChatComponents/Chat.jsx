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
import { ChevronDown } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Message from "./Message";

export function Chat({ currConv, messages, users, handleSendMessage, handleSeenMessage, loading }) {
    const searchParams = useSearchParams();
    const currUser = searchParams.get("userId");
    const chatContainerRef = useRef(null);
    const newMessageRef = useRef(null);
    const [mess, setMess] = useState("");
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);

    // Get messages for current conversation
    const conversationMessages = currConv?.messageIds
        .map(messageId => messages.find(message => message.id === messageId)) || [];
    // Function to show the scroll button if there are new messages
    const handleShowScrollButton = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // Allow a small buffer
        if (!isAtBottom && hasNewMessages) {
            setShowScrollButton(true);
        } else setShowScrollButton(false);
    }
    // Scroll to the new messages divider
    const scrollToNewMessages = () => {
        if (newMessageRef.current) {
            newMessageRef.current.scrollIntoView({ block: "center" });
        }
    };
    // Scroll to the bottom of the conversation
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ block: "end" });
            setShowScrollButton(false);
        }
    };
    // When conversation changes or on initial load
    useEffect(() => {
        if (!currConv) return;
        
        const firstUnreadMessage = conversationMessages.find(message => (message.senderId !== currUser && message.status === "received"));
        setHasNewMessages(!!firstUnreadMessage);
        setFirstUnreadMessageId(firstUnreadMessage?.id || null);
        
        // Set a brief timeout to ensure DOM elements are rendered
        setTimeout(() => {
            if (firstUnreadMessage) {
                scrollToNewMessages();
            } else {
                scrollToBottom();
            }
            if (firstLoad) {
                setFirstLoad(false);
            }
        }, 100);
    }, [currConv]);
    // When messages change
    useEffect(() => {
        if (!currConv || firstLoad) return;

        const firstUnreadMessage = conversationMessages.find(message => (message.senderId !== currUser && message.status === "received"));
        setHasNewMessages(!!firstUnreadMessage);
        setFirstUnreadMessageId(firstUnreadMessage?.id || null);

       // If the last message is from the current user, scroll to bottom
       const lastMessage = conversationMessages[conversationMessages.length - 1];
       if (lastMessage && lastMessage.senderId === currUser) {
           setTimeout(scrollToBottom, 100);
       }
    }, [messages]);
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
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ChatHeader currUser={currUser} currConv={currConv} users={users} />
            <Card className="flex-1 my-2 min-h-0 bg-neutral-100 dark:bg-black overflow-hidden">
                <CardContent className="h-full p-2">
                    <ScrollArea className="h-full w-full overflow-auto"
                                onScroll={handleShowScrollButton}
                    >
                        <div className="flex flex-col">
                            {conversationMessages.map(message => (
                            <div key={message.id}>
                                {(message.id === firstUnreadMessageId) ? (
                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-red-400"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-neutral-100 dark:bg-black px-2 text-sm text-red-500 font-medium">
                                                New Messages
                                            </span>
                                        </div>
                                    </div>
                                ) : null}
                                {(message.id === firstUnreadMessageId) ? (
                                    <div ref={newMessageRef} className="h-0"></div>
                                ) : null}
                                <Message 
                                    message={message} 
                                    users={users} 
                                    conversationMessages={conversationMessages} 
                                    currUser={currUser} 
                                    onMessageSeen={handleSeenMessage}
                                />  
                            </div>
                            ))}
                            <div ref={chatContainerRef} />
                        </div>
                    </ScrollArea>
                    {showScrollButton && (
                        <Button
                            onClick={scrollToBottom}
                            className="absolute bottom-4 right-4 rounded-full shadow-md bg-amber-400 hover:bg-amber-500"
                            size="sm"
                        >
                            <ChevronDown className="mr-1 h-4 w-4" />
                            Scroll to bottom
                        </Button>
                    )}
                </CardContent>
            </Card>
            <ChatInput 
                mess={mess} 
                setMess={setMess} 
                sendMessageHandler={sendMessageHandler} 
                handleKeyPress={handleKeyPress} 
                loading={loading} 
            />
        </div>
    );
}