"use client";

import { useRef, useEffect, useState } from "react";
import { MoveDown } from "lucide-react";

import ChatInput from "@/components/chat/chat-input";
import MessageBubble from "@/components/chat/message-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { useSession } from "@/hooks/use-session";
import { groupMessages } from "@/lib/chat-utils";

const SCROLL_THRESHOLD = 300;

export default function ChatWindow() {
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const { messages, conversations, selectedConversationId, loading: loadingMessages } = useChat();
  const { user } = useSession();

  const bottomRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const curConversation = conversations.find((c) => c.id === selectedConversationId);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    if (scrollHeight - scrollTop - clientHeight > SCROLL_THRESHOLD) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full max-h-[calc(98vh)] overflow-hidden bg-white rounded-none shadow-md">
      {!loadingMessages && messages.length !== 0 && (
        <ScrollArea
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 p-8 pb-31 space-y-4 overflow-y-auto rounded-t-lg"
        >
          {groupMessages(messages)?.map((msgGroup, index) => (
            <MessageBubble
              key={index}
              msgGroup={msgGroup}
              isMe={msgGroup.sender_id === user?.id}
              curConversation={curConversation}
            />
          ))}
          <div className="bg-fuchsia-400" ref={bottomRef} />
        </ScrollArea>
      )}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
        {showScrollToBottom && (
          <Button
            type="button"
            variant="outline"
            className="absolute -top-13 right-5 z-10 flex-shrink-0 h-10 w-10 rounded-full"
            onClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
              setShowScrollToBottom(false);
            }}
          >
            <MoveDown />
          </Button>
        )}
        <ChatInput />
      </div>
    </div>
  );
}
