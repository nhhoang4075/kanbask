"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import { cn } from "@/lib/utils";

// Kết nối tới server Socket.IO (điều chỉnh URL nếu cần)
const socket = io("http://localhost:8080");

const Chat = ({ conversationId, userId, messageData }) => {
  const [messages, setMessages] = useState(messageData);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    // Khi component mount, tham gia conversation
    socket.emit("join_conversation", {
      conversation_id: conversationId,
      user_id: userId,
    });

    // Lắng nghe sự kiện nhận tin nhắn mới
    socket.on("new_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off("new_message");
    };
  }, [conversationId, userId]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("send_message", {
        conversation_id: conversationId,
        sender_id: userId,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-100 rounded shadow-md">
      <h3 className="text-xl font-bold mb-4">Conversation: {conversationId}</h3>
      <h3 className="text-xl font-bold mb-4">User: {userId}</h3>
      <div className="mb-4 h-64 overflow-y-auto bg-white p-2 rounded border border-gray-300 space-y-2">
        {messages.length === 0 && (
          <div className="text-gray-500">No messages yet...</div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "p-2 border-b border-gray-200 ",
              msg.sender_id === userId ? "text-teal-700" : ""
            )}
          >
            <span className="font-semibold">{msg.sender_full_name}:</span>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
