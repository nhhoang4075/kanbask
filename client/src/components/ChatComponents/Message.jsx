/**
 * Message component renders a single chat message with proper formatting,
 * including sender information, timestamps, and message grouping based on
 * the sender and date.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.message - The message object containing details about the message.
 * @param {string} props.message.senderId - The ID of the sender of the message.
 * @param {string} props.message.content - The content of the message.
 * @param {string} props.message.createdAt - The timestamp when the message was created.
 * @param {Array<Object>} props.users - The list of users in the conversation.
 * @param {string} props.users[].id - The ID of a user.
 * @param {string} [props.users[].avatar_url] - The avatar URL of a user.
 * @param {Array<Object>} props.conversationMessages - The list of all messages in the conversation.
 * @param {Object} props.currUserId - The ID of the current user.
 *
 * @returns {JSX.Element|null} The rendered message component or null if the message or sender is invalid.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CheckCheck, Eye, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatData } from "@/hooks/use-chatdata";
import MessageOption from "./MessageOption";

export default function Message({ message, users, conversationMessages, currUserId, handleSeenMessage, handleDeleteMessage }) {
    if (!message) return null;
    const sender = users.find(user => user.id === message.senderId);
    if (!sender) return null;

    const messageRef = useRef(null);
    const { observedMessage, setObservedMessage } = useChatData();
    const [messageHoverId, setMessageHoverId] = useState(null);
    const handleMouseEnter = (id) => {
        setMessageHoverId(id);
    };
    const handleMouseLeave = () => {
        setMessageHoverId(null);
    };
    const isHovered = messageHoverId === message.id;

    // Set up intersection observer to detect when message is visible
    useEffect(() => {
        // Only set up observer for messages sent to current user that aren't already read
        if (message.senderId !== currUserId && message.status === "received" && !observedMessage.includes(message.id)) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Message is visible in the viewport
                        handleSeenMessage && handleSeenMessage(message.id);
                        setObservedMessage(prev => [...prev, message.id]); // Add message ID to observed messages
                        // Disconnect the observer after message is read
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 }); // Message is considered "read" when 50% visible
            // Observe the message element
            if (messageRef.current) {
                observer.observe(messageRef.current);
            }
            // Clean up the observer on component unmount
            return () => {
                observer.disconnect();
                if (messageRef.current) {
                    observer.unobserve(messageRef.current); // Unobserve the message element
                }
            };
        }
    }, [message.id, message.senderId, message.status, currUserId, handleSeenMessage]);
    // Check if the previous message is from the same sender and on the same date
    const prevMessage = conversationMessages[conversationMessages.indexOf(message) - 1];
    const prevIsSameSender = prevMessage && prevMessage.senderId === message.senderId;
    const prevIsSameDate = prevMessage && new Date(prevMessage.createdAt).toDateString() === new Date(message.createdAt).toDateString();

    // Check if the next message is from the same sender and on the same date
    const nextMessage = conversationMessages[conversationMessages.indexOf(message) + 1];
    const nextIsSameSender = nextMessage && nextMessage.senderId === message.senderId;
    const nextIsSameDate = nextMessage && new Date(nextMessage.createdAt).toDateString() === new Date(message.createdAt).toDateString();
    // Check if the message is the last in the group of messages from the same sender
    const isLastInGroup = !nextIsSameSender || (nextIsSameSender && !nextIsSameDate);
    // Check if the message is the last in the conversation
    const isLastMessage = conversationMessages.indexOf(message) === conversationMessages.length - 1;

    return (
        <>
            {(!prevIsSameDate) ? (
                <div className="w-full py-2 text-sm text-gray-500 text-center">
                    {new Date(message.createdAt).toLocaleDateString()}
                </div>
            ) : null}
            
            <div className={cn("flex py-2 gap-2", 
                sender.id === currUserId ? "justify-end" : "justify-start")}
                ref={messageRef}
                onMouseEnter={() => handleMouseEnter(message.id)}
                onMouseLeave={handleMouseLeave}
            >
                <div className={cn("flex mx-2 gap-2", sender.id !== currUserId ? "flex-row" : "flex-row-reverse")}>
                    {(message.senderId !== currUserId && !prevIsSameSender) ? (
                        <Avatar className="flex-none">
                            <AvatarImage src={sender.avatar_url ? sender.avatar_url : null} alt="" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    ) : <div className="flex-none w-8"></div>}
                    <div
                        className={cn("flex items-center p-3 w-fit max-w-md h-fit rounded-md break-words", 
                                    message.status === "deleted" ? "bg-gray-200" : "bg-amber-300")}
                        style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                        }}
                    >
                        {message.status !== "deleted" ? message.content : "This message has been deleted"}
                    </div>
                    {(isLastInGroup && message.status !== "deleted") ? (
                        <div className="text-sm text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    ) : null}
                    {(isHovered && message.status !== "deleted") ? (
                        <MessageOption
                            message={message}
                            users={users}
                            currUserId={currUserId}
                            handleSeenMessage={handleSeenMessage}
                            handleDeleteMessage={handleDeleteMessage}
                        />
                    ) : null}
                </div>
            </div>
            {isLastMessage && (
                <div className="flex justify-end mr-14">
                    {message.status === "read" ? (
                        <Eye className="w-4 h-4 text-gray-500" />
                    ) : message.status === "sent" ? (
                        <Send className="w-4 h-4 text-gray-500" />
                    ) : message.status === "received" ? (
                        <CheckCheck className="w-4 h-4 text-gray-500" />
                    ) : null}
                </div>
            )}
        </>
    );
}