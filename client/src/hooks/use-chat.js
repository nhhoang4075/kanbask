"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useSocket } from "@/hooks/use-socket";
import { getConversations, getParticipantsOfConversation } from "@/actions/conversation-actions";
import { getMessagesOfConversation } from "@/actions/message-actions";

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const { loading: sessionLoading } = useSession();
  const { socket, connected: socketConnected, typingByConversation } = useSocket();
  const router = useRouter();
  const pathname = usePathname();

  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [lastReadMessageId, setLastReadMessageId] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [scrollTargetId, setScrollTargetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const typingUserIds = typingByConversation[selectedConversationId] ?? [];

  const selectedIdRef = useRef(selectedConversationId);
  // Tracks which not-yet-cached conversation id we've already retried a fetch
  // for, so the URL-matching effect below retries once instead of looping.
  const attemptedFetchIdRef = useRef(null);

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
      // A conversation created moments ago (e.g. starting a DM from search)
      // may not be in our locally-cached list yet — refetch once before
      // giving up, instead of immediately bouncing the user away.
      if (attemptedFetchIdRef.current !== cid) {
        attemptedFetchIdRef.current = cid;
        fetchConversations();
        return;
      }

      router.push("/app/message");
      return;
    }

    attemptedFetchIdRef.current = null;

    if (cid !== selectedConversationId) {
      setSelectedConversationId(cid);
      setHighlightId(null);
    }
  }, [pathname, conversations, fetchConversations, router, selectedConversationId]);

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
    setParticipants([]);

    getMessagesOfConversation(selectedConversationId)
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

    // Used for the @mention picker and for highlighting mentions in
    // messages — not part of the initial page load path, so failures here
    // shouldn't surface as a conversation-level error.
    getParticipantsOfConversation(selectedConversationId)
      .then((data) => setParticipants(data.participants))
      .catch(() => {});

    return () => {
      socket.off("update_conversation", handleUpdateConv);
      socket.off("new_message", handleNewMsg);
    };
  }, [socket, socketConnected, sessionLoading, selectedConversationId]);

  const changeConversation = useCallback(
    async (conversationId) => {
      if (!conversationId || conversationId === selectedConversationId) return;

      // A conversation just created via search (starting a new DM) won't be
      // in our cached list yet — refresh it before navigating so the
      // URL-matching effect finds it on the first try.
      if (!conversations.some((c) => c.id === conversationId)) {
        await fetchConversations();
      }

      router.push(`/app/message/${conversationId}`);
    },
    [conversations, selectedConversationId, fetchConversations, router]
  );

  const sendMessage = useCallback(
    (content, mentionedUserIds = []) => {
      const trimmed = content.trim();
      const cid = selectedIdRef.current;
      if (!socketConnected || !cid || !trimmed) return;
      socket.emit("send_message", {
        conversation_id: cid,
        content: trimmed,
        mentioned_user_ids: [...new Set(mentionedUserIds)]
      });
    },
    [socket, socketConnected]
  );

  const sendTyping = useCallback(() => {
    const cid = selectedIdRef.current;
    if (!socketConnected || !cid) return;
    socket.emit("typing", { conversation_id: cid });
  }, [socket, socketConnected]);

  const stopTyping = useCallback(() => {
    const cid = selectedIdRef.current;
    if (!socketConnected || !cid) return;
    socket.emit("stop_typing", { conversation_id: cid });
  }, [socket, socketConnected]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        selectedConversationId,
        changeConversation,
        messages,
        participants,
        lastReadMessageId,
        sendMessage,
        typingUserIds,
        sendTyping,
        stopTyping,
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
