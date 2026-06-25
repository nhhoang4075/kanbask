import Link from "next/link";
import { parseISO, differenceInMinutes } from "date-fns";

const GROUP_THRESHOLD_MINUTES = 5;

export function groupMessages(messages) {
  const groupedMessages = [];

  messages.forEach((msg) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.sender_id === msg.sender_id) {
      const lastMsgInGroup = lastGroup.group[lastGroup.group.length - 1];
      const diff = differenceInMinutes(
        parseISO(msg.created_at),
        parseISO(lastMsgInGroup.created_at)
      );
      if (diff <= GROUP_THRESHOLD_MINUTES) {
        lastGroup.group.push(msg);
        return;
      }
    }

    groupedMessages.push({
      conversation_id: msg.conversation_id,
      sender_id: msg.sender_id,
      sender_full_name: msg.sender_full_name,
      sender_avatar_url: msg.sender_avatar_url,
      group: [msg]
    });
  });

  return groupedMessages;
}

export function linkifyMessage(message) {
  const urlRegex = /(https?:\/\/[\w.-]+(?:\/[\w\-._~:\/?#[\]@!$&'()*+,;=]*)?)/g;
  return message.split(urlRegex).map((part, idx) => {
    if (urlRegex.test(part)) {
      return (
        <Link
          key={idx}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-green hover:underline"
        >
          {part}
        </Link>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export { groupMessages, linkifyMessage };
