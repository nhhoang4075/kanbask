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

import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
// import { Button } from "../ui/button";
import { use, useEffect, useRef, useState } from "react";
import { useChatData } from "@/hooks/use-chatdata";
// import { ChevronDown } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Message from "./Message";

export function Chat({ 
                    currentUserId, 
                    currConv,  
                    handleSendMessage, 
                    // handleSeenMessage, 
                    // handleDeleteMessage, 
                }) {

    const chatContainerRef = useRef(null);
    const newMessageRef = useRef(null);
    const inputRef = useRef(null);
    const [mess, setMess] = useState("");
    const { messages, loading } = useChatData();

    // const [hasNewMessages, setHasNewMessages] = useState(false);
    // const [showScrollButton, setShowScrollButton] = useState(false);
    // const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(null);
    // const [firstLoad, setFirstLoad] = useState(true);
    
    // The scroll is bugged so remove it to fix the socket conversation properly

    // // Function to show the scroll button if user is not at the bottom of the chat
    // const handleShowScrollButton = (e) => {
    //     if (!e.currentTarget) return;
    //     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    //     const isAtBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 0; // Increased buffer for better detection
    //     setShowScrollButton(!isAtBottom);
    // }
    // // Scroll to the new messages divider
    // const scrollToNewMessages = () => {
    //     if (newMessageRef.current) {
    //         newMessageRef.current.scrollIntoView({ block: "center" });
    //     }
    // };
    // // Scroll to the bottom of the conversation
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ block: "end" });
    //         setShowScrollButton(false);
        }
    };
    // // When conversation changes or on initial load
    // useEffect(() => {
    //     if (!currConv) return;
        
    //     const firstUnreadMessage = messages.find(message => (message.senderId !== currentUserId && message.status === "received"));
    //     setHasNewMessages(!!firstUnreadMessage);
    //     setFirstUnreadMessageId(firstUnreadMessage?.id || null);
        
    //     // Set a brief timeout to ensure DOM elements are rendered
    //     setTimeout(() => {
    //         if (firstUnreadMessage) {
    //             scrollToNewMessages();
    //         } else {
    //             scrollToBottom();
    //         }
    //         if (firstLoad) {
    //             setFirstLoad(false);
    //         }
    //     }, 100);
    // }, [currConv]);
    // // When messages change
    // useEffect(() => {
    //     if (!currConv || firstLoad) return;

    //     const firstUnreadMessage = messages.find(message => (message.senderId !== currentUserId && message.status === "received"));
    //     setHasNewMessages(!!firstUnreadMessage);
    //     // Only set the first unread message ID if it hasn't been set yet
    //     setFirstUnreadMessageId(prevId => prevId || firstUnreadMessage?.id || null);

    //    // If the last message is from the current user, scroll to bottom
    //    const lastMessage = messages[messages.length - 1];
    //    if (lastMessage && lastMessage.senderId === currentUserId) {
    //        setTimeout(scrollToBottom, 100);
    //    }
    // }, [messages]);
    
    // Handle Enter key press for sending messages
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageHandler();
        }
    };

    useEffect(() => {
        if (!currConv) return;
        if (chatContainerRef.current)
            scrollToBottom();
    }, [currConv]);

    // Focus on input when the component mounts and when the loading state is false
    useEffect(() => {
        if (inputRef.current && !loading) {
            inputRef.current.focus();
        }
    }, [loading, inputRef]);

    // To do handle file upload
    // This function should handle the file upload logic, e.g., sending the file to the server or processing it
    const handleFileUpload = async (file) => {};
    // Handle sending message
    const sendMessageHandler = async () => {
        if (!mess || mess.trim() === "" || !currConv) return;
        const timeSent = new Date();
        const newMessage = {
            id: `msg-${timeSent.getTime()}`, // Time unique ID to prevent collisions
            conversation_id: currConv.id,
            sender_id: currentUserId,
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
            <ChatHeader currConv={currConv} currrntUserId={currentUserId}/>
            <Card className="flex-1 my-2 min-h-0 bg-neutral-100 dark:bg-black overflow-hidden">
                <CardContent className="flex flex-col items-center h-full p-2">
                    <ScrollArea className="h-full w-full overflow-auto"
                                // onScroll={handleShowScrollButton}
                    >
                        <div className="flex flex-col">
                            {messages?.map(message => (
                            <div key={message?.id}>
                                {/* {(message?.id === firstUnreadMessageId) ? (
                                    <div ref={newMessageRef} className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-red-400"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-neutral-100 dark:bg-black px-2 text-sm text-red-500 font-medium">
                                                New Messages
                                            </span>
                                        </div>
                                    </div>
                                ) : null} */}
                                <Message 
                                    message={message}
                                    messages={messages} 
                                    currentUserId={currentUserId}
                                    // handleSeenMessage={handleSeenMessage}
                                    // handleDeleteMessage={handleDeleteMessage}
                                />  
                            </div>
                            ))}
                            <div ref={chatContainerRef} />
                        </div>
                    </ScrollArea>
                    {/* {showScrollButton && (
                        <Button
                            onClick={scrollToBottom}
                            className="rounded-full shadow-md bg-amber-400 hover:bg-amber-500"
                            size="sm"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    )} */}
                </CardContent>
            </Card>
            <ChatInput 
                mess={mess} 
                setMess={setMess} 
                sendMessageHandler={sendMessageHandler} 
                handleKeyPress={handleKeyPress} 
                loading={loading} 
                inputRef={inputRef}
                handleFileUpload={handleFileUpload}
            />
        </div>
    );
}