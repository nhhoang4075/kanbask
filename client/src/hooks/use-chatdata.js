"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getConversationFromUserId } from "@/lib/ConversationActions";
import { getOneUserById } from "@/lib/UserActions";
import { getManyMessagesByConversationId } from "@/lib/MessageActions";

import { useSession } from "next-auth/react";

const ChatDataContext = createContext(null);

export function ChatDataProvider({ children }) {
    const [conversations, setConversations] = useState([]);
    const [currConv, setCurrConv] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [observedMessage, setObservedMessage] = useState([]);
    const [currUser, setCurrUser] = useState(null);
    const session = useSession();
    const currentUserId = session?.data?.user?.id;
    const convContainerRef = useRef(null);

    useEffect(() => {
        Promise.all([
            getConversationFromUserId(currentUserId),
            getOneUserById(currentUserId),
            // getMessages(),
            // getUsers()
        ]).then(([conversations, currUser]) => {
            setConversations(conversations);
            setCurrUser(currUser);
            // setMessages(messages);
            // setUsers(users);
        }).catch((error) => {
            console.error("Error fetching data:", error);
        });
    }, [currentUserId]);

    useEffect(() => {
        const getMessages = async (conv) => {
            const messages = await getManyMessagesByConversationId(conv.id);
            return messages;
        }
        if (currConv) {
            getMessages(currConv.id).then((messages) => {
                if (messages) setConversationMessages(messages);
            });
        }
    }, [currConv]);

    // useEffect(() => {
    //     // Fetch all data when the provider mounts
    //     Promise.all([
    //         getConversations(), 
    //         getMessages(), 
    //         getUsers()])
    //     .then(async ([conversations, messages, users]) => {
    //         const setReceivedMessages = messages.map((message) => {
    //             // Check if the message is received from another user and update its status
    //             if (message.senderId !== currentUserId && message.status === "sent" && conversations.some(conv => (conv.participants.includes(currentUserId) && conv.id === message.conversationId))) {
    //                 return { ...message, status: "received" };
    //             } else return message;
    //         });
    //         const remainedMessages = setReceivedMessages.filter(message => message.status !== "deleted");
    //         const deletedMessagesIds = messages.filter(message => message.status === "deleted").map(message => message.id);
    //         if (deletedMessagesIds.length > 0) {
    //             // Delete the messages in the server
    //             const result = await deleteMessages({ deleteMessageIds: deletedMessagesIds });
    //             if (result.status !== 201) {
    //                 console.error("Error deleting messages:", result.error);
    //             }
    //             if (result.status === 201 && socket) {
    //                 // Emit the deleted messages to the socket
    //                 deletedMessagesIds.forEach(deletedMessageId => {
    //                     const deletedMessage = setReceivedMessages.find(message => message.id === deletedMessageId);
    //                     socket.emit("delete-message", { message: deletedMessage });
    //                 });
    //             }
    //         }
    //         // Update conversations in the server
    //         let allClear = true;
    //         for (let i = 0; i < deletedMessagesIds.length; i++) {
    //             const deletedMessageId = deletedMessagesIds[i];
    //             const conversationId = setReceivedMessages.find((message) => message.id === deletedMessageId).conversationId;
    //             // Find the last message timeSent in the conversation
    //             const conversationMessages = setReceivedMessages.filter(message => message.conversationId === conversationId && message.id !== deletedMessageId);
    //             const lastMessage = conversationMessages.find(message => conversations.find(conv => conv.id === conversationId).messageIds[conversationMessages.length - 1] === message.id);
    //             const timeSent = lastMessage ? lastMessage.createdAt : null;
    //             const result = await updateConversation({ conversationId: conversationId, messageId: deletedMessageId, timeSent: timeSent, command: "delete" });
    //             if (!result) allClear = false;
    //         }
    //         if (allClear){
    //             // Update conversations by removing deleted message IDs
    //             const updatedConversations = conversations.map(conv => {
    //                 return {
    //                     ...conv,
    //                     messageIds: conv.messageIds.filter(msgId => !deletedMessagesIds.includes(msgId))
    //                 };
    //             });
    //             // Update the conversation update time to the latest message time
    //             updatedConversations.forEach(conv => {
    //                 const convMessages = setReceivedMessages.filter(msg => conv.messageIds.includes(msg.id));
    //                 if (convMessages.length > 0) {
    //                     const lastMessage = convMessages[convMessages.length - 1];
    //                     conv.updatedAt = lastMessage.createdAt;
    //                 }
    //             });
    //             setConversations(updatedConversations);
    //         } else setConversations(conversations);
    //         const changedMessageIds = remainedMessages.filter(message => message.status === "received").map(message => message.id);
    //         if (changedMessageIds.length > 0) {
    //             // Update the messages in the server
    //             const result = await updateMessages({ messageIds: changedMessageIds, changes: { status: "received" } });
    //             if (result.status !== 201) {
    //                 console.error("Error updating messages:", result.error);
    //                 setMessages(messages);
    //             } else setMessages(remainedMessages)
    //             if (result.status === 201 && socket) {
    //                 // Emit the updated messages to the socket
    //                 changedMessageIds.forEach(changedMessageId => {
    //                     const conversationId = remainedMessages.find(message => message.id === changedMessageId)?.conversationId;
    //                     socket.emit("update-message", { messageId: changedMessageId, changes: { status: "received" }, conversationId: conversationId });
    //                 });
    //             }
    //         } else setMessages(messages);
    //         setUsers(users);
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching data:", error);
    //     })
    // }, []);
    // Join all conversations room when the component mounts
    // and leave them when the component unmounts
    return (
        <ChatDataContext.Provider 
          value={{ 
            conversations, 
            setConversations, 
            currConv,
            setCurrConv,
            conversationMessages,
            setConversationMessages,
            searchText,
            setSearchText,
            convContainerRef,
            observedMessage,
            setObservedMessage,
            currentUserId,
            currUser,
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