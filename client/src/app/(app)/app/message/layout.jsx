import AppHeader from "@/components/app/app-header";
import NavConversation from "@/components/chat/nav-conversation";
import ChatWindow from "@/components/chat/chat-window";
import ChatHeader from "@/components/chat/chat-header";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export const metadata = {
  title: "Messages",
  description: "Your Kanbask messages and conversations"
};

export default function ChatPageLayout({ children }) {
  return (
    <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
      <AppHeader name="Messages" />
      <div className="flex-1 overflow-auto">
        <ResizablePanelGroup autoSaveId={"resizable-message"} direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={25} maxSize={35} className="rounded-md">
            <NavConversation />
          </ResizablePanel>
          <ResizableHandle className="mx-0.5 w-0.5 rounded bg-transparent hover:bg-mustard active:bg-mustard transition duration-200 ease-in-out" />
          <ResizablePanel defaultSize={70} className="rounded-md">
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
