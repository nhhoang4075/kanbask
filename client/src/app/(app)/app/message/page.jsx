import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatWindow from "@/components/chat/chat-window";
import ChatHeader from "@/components/chat/chat-header";

export const metadata = {
  title: "Messages",
  description: "Your Kanbask messages and conversations"
};

export default function ChatPage() {
  return (
    <ResizablePanelGroup
      autoSaveId={"resizable-message"}
      direction="horizontal"
      className="max-h-[97dvh]"
    >
      <ResizablePanel defaultSize={30} minSize={25} maxSize={35} className="rounded-md">
        <ChatSidebar />
      </ResizablePanel>
      <ResizableHandle className="mx-0.5 w-0.5 rounded bg-transparent hover:bg-mustard active:bg-mustard transition duration-200 ease-in-out" />
      <ResizablePanel defaultSize={70} className="rounded-md">
        <div className="flex flex-col items-center h-full bg-ghost-white">
          <ChatHeader />
          <ChatWindow />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
