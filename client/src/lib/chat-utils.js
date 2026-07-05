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

// Resolves typing user ids to a displayable {id, full_name, avatar_url} —
// direct conversations always resolve via the conversation itself (the
// title/avatar_url already ARE the other participant's), group conversations
// only resolve for senders already seen in the loaded message history, since
// no participants list is fetched for the chat view.
export function getTypingParticipants(conversation, typingUserIds, messages, currentUserId) {
  if (!conversation) return [];

  const typistIds = typingUserIds.filter((id) => id !== currentUserId);
  if (!typistIds.length) return [];

  if (conversation.type === "direct") {
    return typistIds.includes(conversation.direct_user_id)
      ? [
          {
            id: conversation.direct_user_id,
            full_name: conversation.title,
            avatar_url: conversation.avatar_url
          }
        ]
      : [];
  }

  const byId = new Map();
  messages.forEach((msg) =>
    byId.set(msg.sender_id, { full_name: msg.sender_full_name, avatar_url: msg.sender_avatar_url })
  );

  return typistIds.map((id) => ({
    id,
    full_name: byId.get(id)?.full_name ?? "Someone",
    avatar_url: byId.get(id)?.avatar_url ?? null
  }));
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Highlights "@Full Name" mentions alongside the existing URL linkification.
// Matches against known participant names (rather than any "@word") so a
// message that merely contains a literal "@" isn't mistaken for a mention.
// A lookahead (not \b) ends the match, since \b is ASCII-word-boundary only
// and misbehaves right after names with diacritics (e.g. Vietnamese names).
export function linkifyMessage(message, mentionNames = []) {
  const urlPattern = "(https?://[\\w.-]+(?:/[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*)?)";
  const sortedNames = [...mentionNames].sort((a, b) => b.length - a.length);
  const mentionPattern = sortedNames.length
    ? `(@(?:${sortedNames.map(escapeRegExp).join("|")})(?=\\s|$|[.,!?;:]))`
    : null;

  const regex = new RegExp(mentionPattern ? `${urlPattern}|${mentionPattern}` : urlPattern, "g");

  return message
    .split(regex)
    .filter((part) => part !== undefined)
    .map((part, idx) => {
      if (/^https?:\/\//.test(part)) {
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
      if (part[0] === "@" && sortedNames.some((name) => part === `@${name}`)) {
        return (
          <span key={idx} className="text-blue-green font-medium bg-blue-green/10 rounded px-1">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
}
