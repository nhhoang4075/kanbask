"use client";
import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { Popover, PopoverTrigger } from "../ui/popover";

import AddAttachments from "./add-attachments";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef(null);
  const { sendMessage } = useChat();

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const submitMessage = () => {
    const text = message.trim();
    if (!text) return;
    sendMessage(text);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
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
    <form onSubmit={handleSubmit} className="w-full px-4">
      <div className="flex flex-col items-end px-1 bg-white border-1 rounded-md shadow-md overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-transparent resize-none overflow-auto max-h-40 p-4 placeholder-gray-400 border-none shadow-none focus-visible:ring-0"
          style={{ minHeight: "2rem" }}
        />
        <div className="p-2 space-x-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="flex-shrink-0 h-10 w-10 rounded-full">
                <Paperclip />
              </Button>
            </PopoverTrigger>
            <AddAttachments 
              attachments={attachments}
              setAttachments={setAttachments}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </Popover>
          <Button type="submit" className="flex-shrink-0 h-10 w-10 rounded-full">
            <Send />
          </Button>
        </div>
      </div>
    </form>
  );
}
