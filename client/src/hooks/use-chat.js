"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "@/hooks/use-session";
import { useSocket } from "@/hooks/use-socket";
import { getMessagesOfConversation } from "@/actions/message-actions";

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ initialConversations = [], children }) {
  const { loading: sessionLoading } = useSession();
  const { socket, connected: socketConnected } = useSocket();

  // Conversations list and currently selected conversation
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversations[0]?.id || null
  );
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ref to avoid stale selectedConversationId
  const selectedIdRef = useRef(selectedConversationId);

  useEffect(() => {
    selectedIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Send new message via socket
  const sendMessage = useCallback(
    (content) => {
      const trimmedContent = content.trim();
      const cid = selectedIdRef.current;
      if (!socketConnected || !cid || !trimmedContent) return;
      socket.emit("send_message", { conversation_id: cid, content });
    },
    [socket, socketConnected]
  );

  // Handle real-time updates to conversation list
  useEffect(() => {
    if (!socket || !socketConnected) return;

    const handleUpdateConversation = (updatedConversation) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === updatedConversation.id);
        if (idx !== -1) {
          const newConvs = [...prev];
          newConvs[idx] = updatedConversation;
          return newConvs.sort(
            (a, b) => new Date(b.latest_message_at) - new Date(a.latest_message_at)
          );
        } else {
          return [updatedConversation, ...prev];
        }
      });
    };

    socket.on("update_conversation", handleUpdateConversation);
    return () => socket.off("update_conversation", handleUpdateConversation);
  }, [socket, socketConnected]);

  // Load messages and join room whenever selection changes
  useEffect(() => {
    if (!socket || !socketConnected || !selectedConversationId || sessionLoading) return;

    setLoading(true);

    getMessagesOfConversation(selectedConversationId)
      .then((data) => setMessages(data.messages))
      .catch((err) => console.error("Failed to load messages:", err));

    setLoading(false);

    // Join conversation room (server reads userId from cookie)
    socket.emit("join_conversation", { conversation_id: selectedConversationId });

    const handleNewMessage = (msg) => {
      if (msg.conversation_id === selectedConversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [selectedConversationId, socket, socketConnected, sessionLoading]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        selectedConversationId,
        setSelectedConversationId,
        messages,
        sendMessage,
        loading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
