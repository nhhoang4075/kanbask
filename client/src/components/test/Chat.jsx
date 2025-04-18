// components/Chat.jsx
"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

import { cn } from "@/lib/utils"; // Utility function to combine class names

// Kết nối tới server Socket.IO (điều chỉnh URL nếu cần)
const socket = io(process.env.NEXT_PUBLIC_API_URL);

const Chat = ({ userId, currentConversation, messageData }) => {
  // State to store messages in the conversation
  const [messages, setMessages] = useState(messageData || []);
  // State for new message input
  const [newMessage, setNewMessage] = useState("");
  // State to store the ID of the message currently being edited
  const [editingMessageId, setEditingMessageId] = useState(null);
  // State to store the new content during editing
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    // Emit join event to join the conversation room
    socket.emit("join_conversation", {
      conversation_id: currentConversation.id,
      user_id: userId,
    });

    // Listen for new incoming messages (for new messages sent by others)
    socket.on("new_message", (message) => {
      // Update state by adding the new message to the list
      setMessages((prev) => [...prev, message]);
    });

    // Listen for message editing updates
    socket.on("message_edited", (updatedMessage) => {
      // Replace the edited message within state
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    });

    // Cleanup event listeners on unmount
    return () => {
      socket.off("new_message");
      socket.off("message_edited");
    };
  }, [userId, currentConversation.id]);

  // Function to send a new message
  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("send_message", {
        conversation_id: currentConversation.id,
        sender_id: userId,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  // Function to start editing a message (only allowed for your own messages)
  const startEditing = (msg) => {
    setEditingMessageId(msg.id);
    setEditContent(msg.content);
  };

  // Function to submit the edited message
  const submitEdit = () => {
    if (editContent.trim() !== "") {
      socket.emit("edit_message", {
        message_id: editingMessageId,
        content: editContent,
      });
      // Clear the editing state after submitting
      setEditingMessageId(null);
      setEditContent("");
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col max-h-screen">
      {/* Conversation header */}
      <h3 className="text-xl font-bold mb-4">
        {currentConversation.title || currentConversation.id}
      </h3>

      {/* Message container */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-500">No messages yet...</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              {/* Message block: align right if from current user, otherwise left */}
              <div
                className={cn(
                  "max-w-md p-3 rounded-lg shadow",
                  msg.sender_id === userId
                    ? "self-end bg-blue-500 text-white"
                    : "self-start bg-gray-200 text-gray-900"
                )}
              >
                {/* Display sender full name and edit button if applicable */}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-semibold">
                    {msg.sender_full_name}
                  </span>
                  {msg.sender_id === userId && (
                    <button
                      onClick={() => startEditing(msg)}
                      className="text-xs text-yellow-500 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {/* If the message is being edited, show input and save button */}
                {editingMessageId === msg.id ? (
                  <div className="flex mt-1 space-x-2">
                    <input
                      type="text"
                      className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button
                      onClick={submitEdit}
                      className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  // Otherwise, display the message content
                  <p className="text-base">{msg.content}</p>
                )}
              </div>
              {/* Display a dashed line below the last read message */}
              {msg.id === currentConversation.last_read_message_id &&
                msg.id !== messages[messages.length - 1].id && (
                  <hr className="border-t-2 border-dashed border-gray-400 mt-2" />
                )}
            </div>
          ))
        )}
      </div>

      {/* Input area for sending new message */}
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
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
