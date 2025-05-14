"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import io from "socket.io-client";

import { cn } from "@/lib/utils";

const socket = io("http://localhost:8080");

const Sidebar = ({ userId, conversationData, currentConversationId }) => {
  const [conversations, setConversations] = useState(conversationData);

  useEffect(() => {
    socket.emit("setup", { user_id: userId });

    socket.on("update_conversation", (updatedConversation) => {
      setConversations((prevConvs) => {
        const existedIndex = prevConvs.findIndex(
          (conv) => conv.id === updatedConversation.id
        );

        if (existedIndex !== -1) {
          const newConvs = [...prevConvs];

          newConvs[existedIndex] = updatedConversation;

          return newConvs.sort(
            (a, b) =>
              new Date(b.latest_message_at) - new Date(a.latest_message_at)
          );
        } else {
          return [updatedConversation, ...prevConvs];
        }
      });
    });

    return () => {
      socket.off("update_conversation");
    };
  }, [userId]);

  return (
    <div className="w-64 p-4 bg-gray-100 border-r">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      <ul>
        {conversations &&
          conversations.map((conv) => (
            <li
              key={conv.id}
              className={cn(
                "mb-2 p-2 border-b cursor-pointer",
                conv.id == currentConversationId
                  ? "bg-blue-200"
                  : "hover:bg-gray-50"
              )}
            >
              <Link href={`/test/${userId}/${conv.id}`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{conv.title || conv.id}</span>
                  {conv.unread_count > 0 && (
                    <span className="text-xs text-red-500 font-bold">
                      {conv.unread_count} unread
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conv.latest_message_content}
                </p>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
