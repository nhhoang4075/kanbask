/**
 * Message component renders a single chat message with proper formatting,
 * including sender information, timestamps, and message grouping based on
 * the sender and date.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.message - The message object containing details about the message.
 * @param {string} props.message.sender_id - The ID of the sender of the message.
 * @param {string} props.message.sender_id - The ID of the sender of the message.
 * @param {string} props.message.content - The content of the message.
 * @param {string} props.message.updated_at - The timestamp when the message was created.
 * @param {Array<Object>} props.users - The list of users in the conversation.
 * @param {string} props.users[].id - The ID of a user.
 * @param {string} [props.users[].avatar_url] - The avatar URL of a user.
 * @param {Array<Object>} props.messages - The list of all messages in the conversation.
 * @param {Object} props.currentUserId - The ID of the current user.
 *
 * @returns {JSX.Element|null} The rendered message component or null if the message or sender is invalid.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCheck, Eye, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatData } from "@/hooks/use-chatdata";

import MessageOption from "./MessageOption";

export default function Message({ 
    message,
    messages, 
    currentUserId, 
    // handleSeenMessage, 
    // handleDeleteMessage 
}) {
    const messageRef = useRef(null);
    const [messageHoverId, setMessageHoverId] = useState(null);

    if (!message) {
        return null;
    }
    // Event handlers
    const handleMouseEnter = (id) => {
        setMessageHoverId(id);
    };
    const handleMouseLeave = () => {
        setMessageHoverId(null);
    };
    
    const isHovered = messageHoverId === message.id;
    
    // // Set up intersection observer to detect when message is visible
    // useEffect(() => {
    //     // Only set up observer for messages sent to current user that aren't already read
    //     if (message.sender_id !== currentUserId && message.status === "received" && !observedMessage.includes(message.id)) {
    //         const observer = new IntersectionObserver((entries) => {
    //             entries.forEach(entry => {
    //                 if (entry.isIntersecting) {
    //                     // Message is visible in the viewport
    //                     handleSeenMessage && handleSeenMessage(message.id);
    //                     setObservedMessage(prev => [...prev, message.id]); // Add message ID to observed messages
    //                     // Disconnect the observer after message is read
    //                     observer.disconnect();
    //                 }
    //             });
    //         }, { threshold: 0.5 }); // Message is considered "read" when 50% visible
    //         // Observe the message element
    //         if (messageRef.current) {
    //             observer.observe(messageRef.current);
    //         }
    //         // Clean up the observer on component unmount
    //         return () => {
    //             observer.disconnect();
    //             if (messageRef.current) {
    //                 observer.unobserve(messageRef.current); // Unobserve the message element
    //             }
    //         };
    //     }
    // }, [message.id, message.sender_id, message.status, currentUserId, handleSeenMessage]);
    // Check if the previous message is from the same sender and on the same date
    const prevMessage = messages[messages.indexOf(message) - 1];
    const prevIsSameSender = prevMessage && prevMessage.sender_id === message.sender_id;
    const prevIsSameDate = prevMessage && new Date(prevMessage.updated_at).toDateString() === new Date(message.updated_at).toDateString();

    const nextMessage = messages[messages.indexOf(message) + 1];
    const nextIsSameSender = nextMessage && nextMessage.sender_id === message.sender_id;
    const nextIsSameDate = nextMessage && new Date(nextMessage.updated_at).toDateString() === new Date(message.updated_at).toDateString();
    const isLastInGroup = !nextIsSameSender || (nextIsSameSender && !nextIsSameDate);

    return (
        <>
            {(!prevIsSameDate) ? (
                <div className="w-full py-2 text-sm text-gray-500 text-center">
                    {new Date(message.updated_at).toLocaleDateString()}
                </div>
            ) : null}
            
            <div className={cn("flex py-1 gap-2", 
                message.sender_id === currentUserId ? "justify-end" : "justify-start")}
                ref={messageRef}
                onMouseEnter={() => handleMouseEnter(message.id)}
                onMouseLeave={handleMouseLeave}
            >
                <div className={cn("flex mx-2 gap-2", message.sender_id !== currentUserId ? "flex-row" : "flex-row-reverse")}>
                    {(message.sender_id !== currentUserId && !prevIsSameSender) ? (
                        <Avatar className="flex-none">
                            <AvatarImage src={message.sender_avatar_url ? message.sender_avatar_url : null} alt="" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    ) : <div className="flex-none w-8"></div>}
                    <div className="flex flex-col gap-1">
                        {(!prevIsSameSender && message.sender_id !== currentUserId) ? (
                            <div className="text-sm font-semibold mx-2 text-gray-700 dark:text-gray-200">
                                {message.sender_full_name}
                            </div>
                        ) : null}
                        <div className={cn("flex mx-2 gap-2", message.sender_id !== currentUserId ? "flex-row" : "flex-row-reverse")}>
                            <div
                                className={cn("flex items-center p-3 w-fit max-w-md h-fit rounded-md break-words", 
                                            message.status === "deleted" ? "bg-gray-200" : "bg-blue-400",
                                            message.sender_id !== currentUserId && "bg-amber-300")}
                                style={{
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                }}
                            >
                                {message.status !== "deleted" ? message.content : "This message has been deleted"}
                            </div>
                            {(isLastInGroup && message.status !== "deleted") ? (
                                <div className="text-sm text-gray-500">
                                    {new Date(message.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            ) : null}
                            {(isHovered && message.status !== "deleted") ? (
                                <MessageOption
                                    message={message}
                                    currentUserId={currentUserId}
                                    // handleSeenMessage={handleSeenMessage}
                                    // handleDeleteMessage={handleDeleteMessage}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            {/* {isLastMessage && (
            {/* {isLastMessage && (
                <div className="flex justify-end mr-14">
                    {message.status === "read" ? (
                        <Eye className="w-4 h-4 text-gray-500" />
                    ) : message.status === "sent" ? (
                        <Send className="w-4 h-4 text-gray-500" />
                    ) : message.status === "received" ? (
                        <CheckCheck className="w-4 h-4 text-gray-500" />
                    ) : null}
                </div>
            )} */}
            )} */}
        </>
    );
}