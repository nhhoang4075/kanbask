import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChatProvider } from "@/hooks/use-chat";
import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatWindow from "@/components/chat/chat-window";
import ChatHeader from "@/components/chat/chat-header";
import { getConversations } from "@/actions/conversation-actions";

export default async function ChatPage() {
  const data = await getConversations();

  return (
    <ChatProvider initialConversations={data.conversations}>
      <ResizablePanelGroup direction="horizontal" className="max-h-[97dvh]">
        <ResizablePanel defaultSize={25} className="rounded-l-md">
          <ChatSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75} className="rounded-r-md">
          <ChatHeader />
          <ChatWindow />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ChatProvider>
  );
}
