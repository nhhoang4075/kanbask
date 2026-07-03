"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useSocket } from "@/hooks/use-socket";
import { getConversations } from "@/actions/conversation-actions";
import { getMessagesOfConversation } from "@/actions/message-actions";

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const { loading: sessionLoading } = useSession();
  const { socket, connected: socketConnected } = useSocket();
  const router = useRouter();
  const pathname = usePathname();

  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastReadMessageId, setLastReadMessageId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [scrollTargetId, setScrollTargetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedIdRef = useRef(selectedConversationId);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    const data = await getConversations();
    setConversations(data.conversations);
    setSelectedConversationId(data.conversations[0]?.id || null);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Keep selectedIdRef in sync
  useEffect(() => {
    selectedIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Handle URL-based conversation selection
  useEffect(() => {
    const m = pathname.match(/^\/app\/message\/([a-zA-Z0-9_-]+)$/);
    if (!m) return;

    const cid = parseInt(m[1]);
    if (!conversations.some((c) => c.id === cid)) {
      router.push("/app/message");
      return;
    }

    if (cid !== selectedConversationId) {
      setSelectedConversationId(cid);
      setHighlightId(null);
    }
  }, [pathname, conversations]);

  // Handle conversation updates
  useEffect(() => {
    if (!socketConnected || !selectedConversationId || !socket) return;
    if (sessionLoading) return;

    socket.emit("join_conversation", { conversation_id: selectedConversationId });

    const handleUpdateConv = (updated) => {
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

    const handleNewMsg = (msg) => {
      if (msg.conversation_id === selectedConversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("update_conversation", handleUpdateConv);
    socket.on("new_message", handleNewMsg);

    setLoading(true);

    getMessagesOfConversation(selectedConversationId)
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    return () => {
      socket.off("update_conversation", handleUpdateConv);
      socket.off("new_message", handleNewMsg);
    };
  }, [socket, socketConnected, sessionLoading, selectedConversationId]);

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

  return (
    <ChatContext.Provider
      value={{
        conversations,
        selectedConversationId,
        changeConversation,
        messages,
        lastReadMessageId,
        sendMessage,
        highlightId,
        setHighlightId,
        scrollTargetId,
        setScrollTargetId,
        loading,
        error
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
