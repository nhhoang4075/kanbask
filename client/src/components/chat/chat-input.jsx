"use client";

import { useState, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Send } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MentionPicker from "@/components/chat/mention-picker";
import { useChat } from "@/hooks/use-chat";
import { useSession } from "@/hooks/use-session";

const MAX_MENTION_RESULTS = 6;

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [mentionQuery, setMentionQuery] = useState(null);
  const [mentionStart, setMentionStart] = useState(null);
  const [activeMentionIndex, setActiveMentionIndex] = useState(0);
  const textareaRef = useRef(null);
  const { sendMessage, sendTyping, stopTyping, participants } = useChat();
  const { user } = useSession();

  // Re-announce "typing" at most once every 2s while the user keeps typing
  // (leading-edge only), and announce "stopped typing" 2s after they pause.
  const throttledSendTyping = useDebouncedCallback(sendTyping, 2000, {
    leading: true,
    trailing: false
  });
  const debouncedStopTyping = useDebouncedCallback(stopTyping, 2000);

  useEffect(() => {
    return () => {
      throttledSendTyping.cancel();
      debouncedStopTyping.cancel();
      stopTyping();
    };
  }, []);

  const mentionCandidates =
    mentionQuery === null
      ? []
      : participants
          .filter((p) => p.id !== user?.id)
          .filter((p) => p.full_name.toLowerCase().includes(mentionQuery.toLowerCase()))
          .slice(0, MAX_MENTION_RESULTS);

  const mentionPickerOpen = mentionQuery !== null && mentionCandidates.length > 0;

  // Detects an in-progress "@query" right before the caret — the "@" must
  // start a word (start of message or preceded by whitespace) and nothing
  // after it may contain whitespace yet, otherwise the mention is "closed".
  const detectMentionTrigger = (value, caretPos) => {
    const textBeforeCaret = value.slice(0, caretPos);
    const atIndex = textBeforeCaret.lastIndexOf("@");

    if (atIndex === -1) return null;

    const precedingChar = textBeforeCaret[atIndex - 1];
    const isWordStart = atIndex === 0 || /\s/.test(precedingChar);
    const query = textBeforeCaret.slice(atIndex + 1);

    if (!isWordStart || /\s/.test(query)) return null;

    return { atIndex, query };
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    if (value.trim()) {
      throttledSendTyping();
      debouncedStopTyping();
    } else {
      throttledSendTyping.cancel();
      debouncedStopTyping.cancel();
      stopTyping();
    }

    const trigger = detectMentionTrigger(value, e.target.selectionStart);
    if (trigger) {
      setMentionStart(trigger.atIndex);
      setMentionQuery(trigger.query);
      setActiveMentionIndex(0);
    } else {
      setMentionQuery(null);
    }
  };

  const selectMention = (participant) => {
    const before = message.slice(0, mentionStart);
    const after = message.slice(mentionStart + 1 + mentionQuery.length);
    const insertion = `@${participant.full_name} `;

    setMessage(`${before}${insertion}${after}`);
    setMentionedUsers((prev) =>
      prev.some((u) => u.id === participant.id) ? prev : [...prev, participant]
    );
    setMentionQuery(null);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const pos = before.length + insertion.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(pos, pos);
      }
    });
  };

  const submitMessage = () => {
    const text = message.trim();
    if (!text) return;
    throttledSendTyping.cancel();
    debouncedStopTyping.cancel();
    stopTyping();
    sendMessage(
      text,
      mentionedUsers.map((u) => u.id)
    );
    setMessage("");
    setMentionedUsers([]);
    setMentionQuery(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (mentionPickerOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveMentionIndex((i) => (i + 1) % mentionCandidates.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveMentionIndex((i) => (i - 1 + mentionCandidates.length) % mentionCandidates.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        selectMention(mentionCandidates[activeMentionIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionQuery(null);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessage();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full px-4">
      {mentionPickerOpen && (
        <MentionPicker
          participants={mentionCandidates}
          activeIndex={activeMentionIndex}
          onSelect={selectMention}
          onHoverIndex={setActiveMentionIndex}
        />
      )}
      <div className="flex flex-col items-end px-1 bg-white border-1 rounded-md overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... use @ to mention someone"
          className="flex-1 bg-transparent resize-none overflow-auto max-h-40 p-4 placeholder-gray-400 border-none shadow-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-prussian-blue "
          style={{ minHeight: "2rem" }}
        />
        <div className="p-2 space-x-2">
          <Button
            type="submit"
            className="flex-shrink-0 h-10 w-10 rounded-full bg-prussian-blue text-ghost-white"
          >
            <Send />
          </Button>
        </div>
      </div>
    </form>
  );
}
