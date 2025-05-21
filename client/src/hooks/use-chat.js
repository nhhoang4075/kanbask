"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  // Conversations list and currently selected conversation
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversations[0]?.id || null
  );
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrollTargetId, setScrollTargetId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  const selectedIdRef = useRef(selectedConversationId);
  useEffect(() => {
    selectedIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    const m = pathname.match(/^\/app\/message\/([a-zA-Z0-9_-]+)$/);
    if (!m) {
      return;
    }

    const cid = parseInt(m[1]);
    if (!conversations.some((c) => c.id === cid)) {
      router.push("/app/message");
    }

    if (cid !== selectedConversationId) {
      setSelectedConversationId(cid);
      setHighlightId(null);
    }
  }, [pathname]);

  const changeConversation = (conversationId) => {
    if (conversationId && conversationId !== selectedConversationId) {
      router.push(`/app/message/${conversationId}`);
    }
  };

  const sendMessage = useCallback(
    (content) => {
      const trimmed = content.trim();
      const cid = selectedIdRef.current;
      if (!socketConnected || !cid || !trimmed) return;
      socket.emit("send_message", { conversation_id: cid, content: trimmed });
    },
    [socket, socketConnected]
  );

  useEffect(() => {
    if (!socket || !socketConnected) return;
    const handleUpdate = (updated) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === updated.id);
        if (idx !== -1) {
          const arr = [...prev];
          arr[idx] = updated;
          return arr.sort((a, b) => new Date(b.latest_message_at) - new Date(a.latest_message_at));
        }
        return [updated, ...prev];
      });
    };
    socket.on("update_conversation", handleUpdate);
    return () => socket.off("update_conversation", handleUpdate);
  }, [socket, socketConnected]);

  useEffect(() => {
    if (!socketConnected || !selectedConversationId || sessionLoading) return;
    setLoading(true);
    getMessagesOfConversation(selectedConversationId)
      .then((data) => setMessages(data.messages))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    socket.emit("join_conversation", { conversation_id: selectedConversationId });
    const handleNewMsg = (msg) => {
      if (msg.conversation_id === selectedConversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("new_message", handleNewMsg);
    return () => socket.off("new_message", handleNewMsg);
  }, [selectedConversationId, socketConnected, sessionLoading]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        selectedConversationId,
        messages,
        loading,
        error,
        changeConversation,
        sendMessage,
        scrollTargetId,
        setScrollTargetId,
        highlightId,
        setHighlightId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
