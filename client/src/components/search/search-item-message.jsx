import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { useSearch } from "@/hooks/use-search";
import { useChat } from "@/hooks/use-chat";
import { formatShortTimestamp } from "@/lib/utils";

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
    <li onClick={() => jumpToMessage(message.conversation_id, message.id)}>
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between gap-4 mx-6 my-2 py-2 px-4 text-left text-md rounded-md bg-white hover:bg-prussian-blue/5 cursor-pointer transition-colors duration-200 ease-in-out">
              <div className=" flex-1 flex items-center gap-4">
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
              </div>
              <div className="flex-none text-end min-w-10">
                <span className="text-xs text-gray-500">
                  {formatShortTimestamp(message.created_at)}
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-prussian-blue text-white">
            Open in conversation
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
}
