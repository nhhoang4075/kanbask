"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useChat } from "@/hooks/use-chat";
import ChatTabs from "./chat-tabs";

export default function NavConversation() {
  const { conversations, loading } = useChat();
  return (
    <Card className="h-full shadow-lg rounded-none overflow-hidden">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="px-6 py-4 bg-ghost-white border-b">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        {(loading) ? (
          <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Loading conversations...</p>
          </div>
        ) : null}
        {(!loading && !conversations?.length) ? (
          <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">No conversations available</p>
          </div>
        ) : null}
        {(!loading && conversations?.length) ? (
          <ChatTabs />
        ) : null}
      </CardContent>
    </Card>
  );
}
