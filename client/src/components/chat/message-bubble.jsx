import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatTimestampHour, formatFullTimestamp, linkifyMessage } from "@/lib/chat-utils";

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

export default function MessageBubble({ msgGroup, isMe, curConversation }) {
  return (
    <div className={`flex justify-start gap-x-3 mb-8 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8 overflow-hidden border-b">
        <AvatarImage
          src={msgGroup.sender_avatar_url}
          alt={msgGroup.sender_full_name}
          className="object-cover"
        />
        <AvatarFallback className="bg-mustard">
          {msgGroup.sender_full_name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 flex flex-col gap-y-1.5 ${isMe ? "items-end" : "items-start"}`}>
        <div className={`flex gap-x-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
          <span className="peer text-xs text-gray-500">{msgGroup.sender_full_name}</span>
          <span className="text-xs text-gray-500 peer-hover:opacity-100 opacity-0 transition-opacity duration-200 select-none">
            {formatFullTimestamp(msgGroup.group[0].created_at)}
          </span>
        </div>

        {msgGroup.group.map((msg, idx) => (
          <div key={msg.id} className="w-full">
            <div className={`flex items-center gap-x-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`peer max-w-[75%] px-4 py-2 rounded-2xl break-words text-gray-800 ${
                  isMe ? "bg-sky-blue/50" : "bg-gray-200"
                } ${messageBubbleStyle(idx, msgGroup.group.length, isMe)}`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {linkifyMessage(msg.content)}
                </p>
              </div>
              <span className="text-xs text-gray-500 peer-hover:opacity-100 opacity-0 transition-opacity duration-200 select-none">
                {formatTimestampHour(msg.created_at)}
              </span>
            </div>

            {msg.id === curConversation?.last_read_message_id &&
              msg.id !== curConversation.latest_message_id && (
                <div className="flex items-center my-4" key={`divider-${msg.id}`}>
                  <div className="flex-grow h-px bg-gray-400" />
                  <span className="px-2 text-xs text-gray-500 whitespace-nowrap">Last Read</span>
                  <div className="flex-grow h-px bg-gray-400" />
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
