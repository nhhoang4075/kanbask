"use client";

import { useEffect } from "react";
import { useChatData } from "./use-chatdata";
import { useSocket } from "./use-socket";
import { useSearchParams } from "next/navigation";
import { updateMessages } from "@/lib/MessageActions";


export function ListenerProvider({ children }) {
  const { socket, isConnected } = useSocket();
  const { conversations, setConversations, messages, setMessages, currConv, setCurrConv } = useChatData();
  const searchParams = useSearchParams();
  const currentUserId = searchParams.get("userId");

  useEffect(() => {
    if (!isConnected || !socket) return;
    // Handle socket events
    socket.on("received-message", async (message) => {
        // Check if the message is from another user and update its status
        if (message.senderId !== currentUserId && message.status === "sent") {
            message.status = "received";
            await updateMessages({ messagesId: [message.id], changes: { status: "received" } });
            if (socket){
                socket.emit("update-message", { messageId: message.id, changes: { status: "received" }, conversationId: message.conversationId });
            }
        }
        setMessages((prevMessages) => [...prevMessages, message]);
        // Update the conversation if it already exists
        const updatedConversations = conversations.map((conv) => {
            if (conv.id === message.conversationId) {
                return {
                    ...conv,
                    messageIds: [...conv.messageIds, message.id],
                    updatedAt: message.createdAt,
                };
            }
            return conv;
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setConversations(updatedConversations);
        // Update the current conversation if it matches
        if (currConv && currConv.id === message.conversationId) {
            setCurrConv({
                ...currConv,
                messageIds: [...currConv.messageIds, message.id],
                updatedAt: message.createdAt,
            });
        }
    });
    // Update the message when it is updated from another client
    socket.on("updated-message", ({ messageId, changes }) => {           
        setMessages((prevMessages) => prevMessages.map((message) => {
            if (message.id === messageId) {
                return { ...message, ...changes };
            }
            return message;
        }));
    })
    socket.on("deleted-message", ({ messageId }) => {
        const message = messages.find((msg) => msg.id === messageId);
        if (!message) return;
        setMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
        const updatedConversations = conversations.map((conv) => {
            if (conv.id === message.conversationId) {
                return {
                    ...conv,
                    messageIds: conv.messageIds.filter((id) => id !== messageId)
                };
            }
            return conv;
        });
        setConversations(updatedConversations);
    })
    return () => {
        socket.off("received-message");
        socket.off("updated-message");
        socket.off("deleted-message");
    }
  }, [socket, currConv, currentUserId, conversations]);
  return (
    <>
      {children}
    </>
  );
}