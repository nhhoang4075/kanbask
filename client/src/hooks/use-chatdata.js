"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getConversations } from "@/lib/ConversationActions";
import { getMessages, updateMessages } from "@/lib/MessageActions";
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
    const currentId = searchParams.get("userId");
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
                if (message.senderId !== currentId && message.status === "sent" && conversations.some(conv => (conv.participants.includes(currentId) && conv.id === message.conversationId))) {
                    return { ...message, status: "received" };
                } else return message;
            });
            setConversations(conversations);
            const changedMessagesId = setReceivedMessages.filter(message => message.status === "received").map(message => message.id);
            if (changedMessagesId.length > 0) {
                // Update the messages in the server
                const result = await updateMessages({ messagesId: changedMessagesId, changes: { status: "received" } });
                if (result.status !== 201) {
                    console.error("Error updating messages:", result.error);
                } else setMessages(setReceivedMessages)
                if (result.status === 201 && socket) {
                    // Emit the updated messages to the socket
                    socket.emit("update-message", { messagesId: changedMessagesId, changes: { status: "received" } });
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
        conversations.filter(conv => conv.participants.includes(currentId)).forEach((conv) => {
            if (socket) {
                socket.emit("join", conv.id);
            }
        });
        return () => {
            conversations.filter(conv => conv.participants.includes(currentId)).forEach((conv) => {
                if (socket) {
                    socket.emit("leave", conv.id);
                }
            });
        }
    }, [socket, conversations, currentId]);
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