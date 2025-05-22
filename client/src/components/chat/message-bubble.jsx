import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useChat } from "@/hooks/use-chat";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { linkifyMessage } from "@/lib/chat-utils";
import { cn, formatTimestampHour, formatFullTimestamp } from "@/lib/utils";

function messageBubbleStyle(curIdx, msgGroupLength, isMe) {
  if (msgGroupLength === 1) {
    return "rounded-md";
  } else if (curIdx === 0) {
    return `rounded-md ${isMe ? "rounded-br-none" : "rounded-bl-none"}`;
  } else if (curIdx === msgGroupLength - 1) {
    return `rounded-md ${isMe ? "rounded-tr-none" : "rounded-tl-none"}`;
  } else {
    return `rounded-md ${isMe ? "rounded-r-none" : "rounded-l-none"}`;
  }
}

export default function MessageBubble({ msgGroup, isMe }) {
  const { highlightId } = useChat();

  return (
    <div className={cn("flex justify-start gap-x-3 my-4", isMe ? "flex-row-reverse" : "flex-row")}>
      <Avatar className="h-8 w-8 overflow-hidden border-b">
        <AvatarImage
          src={msgGroup.sender_avatar_url}
          alt={msgGroup.sender_full_name}
          className="object-cover"
        />
        <AvatarFallback className="text-sm" style={pickAvatarColor(msgGroup.sender_full_name)}>
          {getInitials(msgGroup.sender_full_name)}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex-1 flex flex-col gap-y-1.5", isMe ? "items-end" : "items-start")}>
        <div className={cn("flex gap-x-2", isMe ? "flex-row-reverse" : "flex-row")}>
          <span className="peer text-xs text-gray-500">{msgGroup.sender_full_name}</span>
          <span className="text-xs text-gray-500 peer-hover:opacity-100 opacity-0 transition-opacity duration-200 select-none">
            {formatFullTimestamp(msgGroup.group[0].created_at)}
          </span>
        </div>

        {msgGroup.group.map((msg, idx) => (
          <div key={msg.id} id={`msg-${msg.id}`} className="w-full">
            <div
              className={cn("flex items-center gap-x-4", isMe ? "flex-row-reverse" : "flex-row")}
            >
              <div
                className={cn(
                  "peer max-w-[75%] px-4 py-2 rounded-2xl break-words text-gray-800",
                  isMe ? "bg-sky-blue/50" : "bg-gray-200",
                  messageBubbleStyle(idx, msgGroup.group.length, isMe),
                  msg.id === highlightId && "ring-2 ring-prussian-blue"
                )}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {linkifyMessage(msg.content)}
                </p>
              </div>
              <span
                className={cn(
                  "text-xs text-gray-500 opacity-0 transition-opacity duration-200 select-none",
                  msg.id === highlightId ? "opacity-100" : "peer-hover:opacity-100"
                )}
              >
                {formatTimestampHour(msg.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
