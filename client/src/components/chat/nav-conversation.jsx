"use client";

import { useMemo } from "react";

import NavConversationItem from "@/components/chat/nav-conversation-item";
import NotFound from "@/components/app/not-found";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/use-chat";

export default function NavConversation() {
  const { conversations } = useChat();

  const notPendingConversations = useMemo(
    () => conversations.filter((conv) => !conv.is_pending),
    [conversations]
  );
  const unreadConversations = useMemo(
    () => conversations.filter((conv) => conv.unread_count > 0),
    [conversations]
  );

  return (
    <Card className="h-full p-0 shadow-lg rounded-none overflow-hidden bg-ghost-white">
      <CardContent className="flex flex-col h-full p-0">
        <Tabs defaultValue="all" className="w-full h-full gap-0 bg-ghost-white">
          <TabsList className="flex gap-1 my-1 px-4 rounded-none bg-ghost-white">
            <TabsTrigger
              value="all"
              className="text-md bg-ghost-white text-gray-500 rounded-none shadow-none data-[state=active]:text-black data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <div className="w-px h-1/2 bg-black" />
            <TabsTrigger
              value="unread"
              className="text-md bg-ghost-white text-gray-500 rounded-none shadow-none data-[state=active]:text-black data-[state=active]:shadow-none"
            >
              Unread
            </TabsTrigger>
          </TabsList>
          <div className="h-px bg-border" />
          <TabsContent value="all">
            {notPendingConversations.length ? (
              <ScrollArea className="flex-1">
                <ul className="divide-y divide-border">
                  {notPendingConversations.map((conversation) => {
                    return (
                      <NavConversationItem key={conversation.id} conversation={conversation} />
                    );
                  })}
                </ul>
              </ScrollArea>
            ) : (
              <NotFound message="No conversations found" description="Start a new conversation!" />
            )}
          </TabsContent>
          <TabsContent value="unread">
            {unreadConversations.length ? (
              <ScrollArea className="flex-1">
                <ul className="divide-y divide-border">
                  {unreadConversations.map((conversation) => {
                    return (
                      <NavConversationItem key={conversation.id} conversation={conversation} />
                    );
                  })}
                </ul>
              </ScrollArea>
            ) : (
              <NotFound
                message="No conversations found"
                description="All conversations are read!"
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
