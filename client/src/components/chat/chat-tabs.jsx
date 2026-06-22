import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useChat } from "@/hooks/use-chat";
import Conversation from "./conversation";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatTabs() {
  const { conversations, selectedConversationId, setSelectedConversationId } = useChat();

  return (
    <Tabs defaultValue="all" className="w-full h-full py-1 bg-ghost-white">
    <TabsList className="flex w-full space-x-1">
        <TabsTrigger value="all" className="font-roboto text-md rounded-none shadow-none data-[state=active]:border-b-prussian-blue data-[state=active]:shadow-none">All</TabsTrigger>
        <TabsTrigger value="unread" className="font-roboto text-md rounded-none data-[state=active]:border-b-prussian-blue data-[state=active]:shadow-none">Unread</TabsTrigger>
    </TabsList>
      {/* <div ref={convContainerRef}></div> */}
      <TabsContent value="all">
        <ScrollArea className="flex-1" >
          <ul className="divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const selected = conversation.id === selectedConversationId;
              return (
                <Conversation 
                  key={conversation.id} 
                  currConv={conversation} 
                  setSelectedConversationId={setSelectedConversationId} 
                  selected={selected}
                />
              )})}
          </ul>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="unread">
        <ScrollArea className="flex-1" >
          <ul className="divide-y divide-gray-200">
            {conversations.filter(conv => conv.unread_count > 0).map((conversation) => {
              const selected = conversation.id === selectedConversationId;
              return (
                <Conversation 
                  key={conversation.id} 
                  currConv={conversation} 
                  setSelectedConversationId={setSelectedConversationId}
                  selected={selected}
                />
              )})}
          </ul>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}