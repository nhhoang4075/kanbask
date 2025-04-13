"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getConversations, updateConversation } from "@/lib/ConversationActions";
import { getMessages, updateMessages, deleteMessages } from "@/lib/MessageActions";
import { getUsers } from "@/lib/UserActions";
import { useSocket } from "./use-socket";

const ChatDataContext = createContext(null);

export function ChatDataProvider({ children }) {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [currConv, setCurrConv] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [observedMessage, setObservedMessage] = useState([]);
    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const currentUserId = searchParams.get("userId");
    const convContainerRef = useRef(null);

    useEffect(() => {
        // Fetch all data when the provider mounts
        Promise.all([
            getConversations(), 
            getMessages(), 
            getUsers()])
        .then(async ([conversations, messages, users]) => {
            const setReceivedMessages = messages.map((message) => {
                // Check if the message is received from another user and update its status
                if (message.senderId !== currentUserId && message.status === "sent" && conversations.some(conv => (conv.participants.includes(currentUserId) && conv.id === message.conversationId))) {
                    return { ...message, status: "received" };
                } else return message;
            });
            const remainedMessages = setReceivedMessages.filter(message => message.status !== "deleted");
            const deletedMessagesIds = messages.filter(message => message.status === "deleted").map(message => message.id);
            if (deletedMessagesIds.length > 0) {
                // Delete the messages in the server
                const result = await deleteMessages({ deleteMessageIds: deletedMessagesIds });
                if (result.status !== 201) {
                    console.error("Error deleting messages:", result.error);
                }
                if (result.status === 201 && socket) {
                    // Emit the deleted messages to the socket
                    deletedMessagesIds.forEach(deletedMessageId => {
                        const deletedMessage = setReceivedMessages.find(message => message.id === deletedMessageId);
                        socket.emit("delete-message", { message: deletedMessage });
                    });
                }
            }
            // Update conversations in the server
            let allClear = true;
            for (let i = 0; i < deletedMessagesIds.length; i++) {
                const deletedMessageId = deletedMessagesIds[i];
                const conversationId = setReceivedMessages.find((message) => message.id === deletedMessageId).conversationId;
                // Find the last message timeSent in the conversation
                const conversationMessages = setReceivedMessages.filter(message => message.conversationId === conversationId && message.id !== deletedMessageId);
                const lastMessage = conversationMessages.find(message => conversations.find(conv => conv.id === conversationId).messageIds[conversationMessages.length - 1] === message.id);
                const timeSent = lastMessage ? lastMessage.createdAt : null;
                const result = await updateConversation({ conversationId: conversationId, messageId: deletedMessageId, timeSent: timeSent, command: "delete" });
                if (!result) allClear = false;
            }
            if (allClear){
                // Update conversations by removing deleted message IDs
                const updatedConversations = conversations.map(conv => {
                    return {
                        ...conv,
                        messageIds: conv.messageIds.filter(msgId => !deletedMessagesIds.includes(msgId))
                    };
                });
                // Update the conversation update time to the latest message time
                updatedConversations.forEach(conv => {
                    const convMessages = setReceivedMessages.filter(msg => conv.messageIds.includes(msg.id));
                    if (convMessages.length > 0) {
                        const lastMessage = convMessages[convMessages.length - 1];
                        conv.updatedAt = lastMessage.createdAt;
                    }
                });
                setConversations(updatedConversations);
            } else setConversations(conversations);
            const changedMessageIds = remainedMessages.filter(message => message.status === "received").map(message => message.id);
            if (changedMessageIds.length > 0) {
                // Update the messages in the server
                const result = await updateMessages({ messageIds: changedMessageIds, changes: { status: "received" } });
                if (result.status !== 201) {
                    console.error("Error updating messages:", result.error);
                    setMessages(messages);
                } else setMessages(remainedMessages)
                if (result.status === 201 && socket) {
                    // Emit the updated messages to the socket
                    changedMessageIds.forEach(changedMessageId => {
                        const conversationId = remainedMessages.find(message => message.id === changedMessageId)?.conversationId;
                        socket.emit("update-message", { messageId: changedMessageId, changes: { status: "received" }, conversationId: conversationId });
                    });
                }
            } else setMessages(messages);
            setUsers(users);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        })
    }, []);
    // Join all conversations room when the component mounts
    // and leave them when the component unmounts
    useEffect(() => {
        conversations.filter(conv => conv.participants.includes(currentUserId)).forEach((conv) => {
            if (socket) {
                socket.emit("join", conv.id);
            }
        });
        return () => {
            conversations.filter(conv => conv.participants.includes(currentUserId)).forEach((conv) => {
                if (socket) {
                    socket.emit("leave", conv.id);
                }
            });
        }
    }, [socket, conversations, currentUserId]);
    return (
        <ChatDataContext.Provider 
          value={{ 
            conversations, 
            setConversations, 
            messages, 
            setMessages,
            users,
            setUsers,
            currConv,
            setCurrConv,
            searchText,
            setSearchText,
            convContainerRef,
            observedMessage,
            setObservedMessage,
          }}>
            {children}
        </ChatDataContext.Provider>
    );
};

export function useChatData() {
    const context = useContext(ChatDataContext);
    if (!context) {
        throw new Error("useChatData must be used within a ChatDataProvider");
    }
    return context;
}