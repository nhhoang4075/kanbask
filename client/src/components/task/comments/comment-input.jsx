"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTaskComment } from "@/hooks/use-task-comment";

export default function CommentInput({ task }) {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const { handleCreateComment } = useTaskComment();

  const handleChange = (e) => {
    setContent(e.target.value);
    // if (textareaRef.current) {
    //   textareaRef.current.style.height = "auto";
    //   textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    // }
  };

  const submitMessage = () => {
    const text = content.trim();

    if (!text) return;

    handleCreateComment({ task_id: task.id, content: text });
    setContent("");
    // if (textareaRef.current) {
    //   textareaRef.current.style.height = "auto";
    // }
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
    <form onSubmit={handleSubmit} className="w-full p-6">
      <div className="flex flex-col items-end px-1 bg-white border-1 rounded-md shadow-md overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent resize-none overflow-auto max-h-40 p-4 placeholder-gray-400 border-none shadow-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-prussian-blue "
        />
        <div className="p-2 space-x-2">
          <Button
            type="submit"
            className="flex-shrink-0 h-8 w-8 rounded-full bg-prussian-blue text-ghost-white"
          >
            <Send />
          </Button>
        </div>
      </div>
    </form>
  );
}
