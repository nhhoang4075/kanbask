import Link from "next/link";
import { format, isSameDay, isSameYear, parseISO, differenceInMinutes } from "date-fns";

function formatTimestampHour(isoString) {
  return format(isoString, "HH:mm");
}

function formatFullTimestamp(isoString) {
  const date = parseISO(isoString);
  const now = new Date();

  if (isSameDay(date, now)) {
    return format(date, "HH:mm");
  } else if (isSameYear(date, now)) {
    return format(date, "MMM d, HH:mm");
  } else {
    return format(date, "MMM d yyyy, HH:mm");
  }
}

function formatShortTimestamp(isoString) {
  const date = parseISO(isoString);
  const now = new Date();

  if (isSameDay(date, now)) {
    return format(date, "HH:mm");
  } else if (isSameYear(date, now)) {
    return format(date, "MMM d");
  } else {
    return format(date, "MMM d, yyyy");
  }
}

const GROUP_THRESHOLD_MINUTES = 5;

function groupMessages(messages) {
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

function linkifyMessage(message) {
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

export {
  formatTimestampHour,
  formatFullTimestamp,
  formatShortTimestamp,
  groupMessages,
  linkifyMessage
};
