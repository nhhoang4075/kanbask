import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { useSearch } from "@/hooks/use-search";
import { useChat } from "@/hooks/use-chat";

export default function SearchItemMessage({ message }) {
  const { setOpen } = useSearch();
  const { setScrollTargetId } = useChat();
  const router = useRouter();

  const jumpToMessage = (conversationId, messageId) => {
    router.push(`/app/message/${conversationId}`);
    setScrollTargetId(messageId);
    setOpen(false);
  };

  return (
    <li
      className="flex items-center gap-4 mx-6 my-2 py-2 px-4 text-left text-md rounded-md bg-white hover:bg-prussian-blue/5 cursor-pointer"
      onClick={() => jumpToMessage(message.conversation_id, message.id)}
    >
      <Avatar className="h-10 w-10 rounded-full overflow-hidden">
        <AvatarImage
          src={message.sender_avatar_url}
          alt={message.sender_full_name}
          className="object-cover"
        />
        <AvatarFallback style={pickAvatarColor(message.sender_full_name)}>
          {getInitials(message.sender_full_name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-md">
        <span className="truncate font-medium">{message.sender_full_name}</span>
        <span className="truncate text-xs text-muted-foreground">{message.content}</span>
      </div>
    </li>
  );
}
