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
    <Card className="h-full p-0 shadow-lg rounded-none bg-ghost-white overflow-hidden">
      <CardContent className="p-0 h-full">
        <Tabs defaultValue="all" className="h-full">
          <TabsList className="justify-start w-full px-6 gap-x-6 rounded-none border-b bg-white">
            <TabsTrigger
              value="all"
              className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
            >
              Unread
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="m-0 h-full">
            {notPendingConversations.length ? (
              <ScrollArea className="h-[calc(98vh-100px)] overflow-y-auto">
                <ul className="divide-y divide-border">
                  {notPendingConversations.map((conversation) => (
                    <NavConversationItem key={conversation.id} conversation={conversation} />
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <NotFound message="No conversations found" description="Start a new conversation!" />
            )}
          </TabsContent>
          <TabsContent value="unread" className="m-0 h-full">
            {unreadConversations.length ? (
              <ScrollArea className="h-[calc(98vh-100px)] overflow-y-auto">
                <ul className="divide-y divide-border">
                  {unreadConversations.map((conversation) => (
                    <NavConversationItem key={conversation.id} conversation={conversation} />
                  ))}
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
