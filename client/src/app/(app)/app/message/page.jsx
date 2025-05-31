import ChatWindow from "@/components/chat/chat-window";
import ChatHeader from "@/components/chat/chat-header";

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center h-full bg-ghost-white">
      <ChatHeader />
      <ChatWindow />
    </div>
  );
}
