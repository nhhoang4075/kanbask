"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { MoveDown } from "lucide-react";

import ChatInput from "@/components/chat/chat-input";
import MessageBubble from "@/components/chat/message-bubble";
import Spinner from "@/components/app/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { useSession } from "@/hooks/use-session";
import { groupMessages } from "@/lib/chat-utils";

const SCROLL_THRESHOLD = 300;

export default function ChatWindow() {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const {
    messages,
    conversations,
    selectedConversationId,
    loading,
    scrollTargetId,
    setScrollTargetId,
    setHighlightId
  } = useChat();
  const { user } = useSession();

  const bottomRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const currConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId]
  );

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShowScrollToBottom(scrollHeight - scrollTop - clientHeight > SCROLL_THRESHOLD);
  };

  // Always scroll to bottom on new messages (unless hidden by user scroll)
  useEffect(() => {
    if (!showScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  useEffect(() => {
    if (!loading && scrollTargetId && scrollAreaRef.current) {
      const el = document.getElementById(`msg-${scrollTargetId}`);

      if (el) {
        const top = el.offsetTop;
        scrollAreaRef.current.scrollTo({ top: top - 30, behavior: "smooth" });
        setHighlightId(scrollTargetId);
        setScrollTargetId(null);
      }
    }
  }, [loading, scrollTargetId]);

  if (!currConversation) {
    return;
  }

  return (
    <div className="relative flex-1 flex flex-col w-full overflow-hidden bg-ghost-white shadow-md">
      {loading ? (
        <div className="flex-1 flex w-full">
          <Spinner size="lg" className="-translate-y-16" />
        </div>
      ) : (
        <ScrollArea
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 m-0 px-8 pb-36 overflow-y-scroll xl:px-16"
        >
          {groupMessages(messages)?.map((msgGroup, idx) => (
            <MessageBubble key={idx} msgGroup={msgGroup} isMe={msgGroup.sender_id === user?.id} />
          ))}
          <div ref={bottomRef} />
        </ScrollArea>
      )}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
        <ChatInput />
        {showScrollToBottom && (
          <Button
            variant="outline"
            className="absolute -top-12 right-5 h-10 w-10 rounded-full bg-white"
            onClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
              setShowScrollToBottom(false);
            }}
          >
            <MoveDown />
          </Button>
        )}
      </div>
    </div>
  );
}
