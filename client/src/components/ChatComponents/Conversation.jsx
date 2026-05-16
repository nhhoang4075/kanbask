/**
 * Conversation component renders a button representing a conversation.
 * It displays the conversation's participants, last message, and last update time.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.conversation - The conversation object containing details about the conversation.
 * @param {string} props.currentUserId - The ID of the current user.
 * @param {Object} props.currConv - The currently selected conversation object.
 * @param {Function} props.setCurrConv - Function to set the currently selected conversation.
 * @param {Array} props.messages - Array of message objects associated with the conversation.
 * @param {Array} props.users - Array of user objects participating in the conversation.
 *
 * @returns {JSX.Element} A button element representing the conversation.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getParticipantsOfConversation } from "@/lib/ConversationActions";
import { getOneUserById } from "@/lib/UserActions";
import { useEffect, useState } from "react";

const getUser = async (userId) => {
  const user = await getOneUserById(userId);
  return user;
};

export default function Conversation({
  conversation,
  currentUserId,
  currConv,
  setCurrConv,
  participants,
}) {
  const lastUpdate =
    conversation.latest_message_at && new Date(conversation.latest_message_at);
  const router = useRouter();
  // Find the last message in the conversation
  const lastMessage = lastUpdate ? conversation.latest_message_content : null;
  const receiverUsers = participants?.filter(
    (user) => user.id !== currentUserId
  );
  // // Set the current conversation and update the URL
  const changeConversation = () => {
    setCurrConv(conversation);
    console.log("Conversation", conversation);
    router.push(`/message/${conversation.id}`, undefined, { shallow: true });
    console.log("Conversation", conversation);
    router.push(`/message/${conversation.id}`, undefined, { shallow: true });
  };
  return (
    <button
      onClick={changeConversation}
      className={cn(
        "flex gap-2 p-4 w-full rounded-2xl hover:bg-gray-200",
        conversation?.id === currConv?.id && "bg-gray-300"
      )}
    >
      <Avatar className="flex-none">
        <AvatarImage
          src={receiverUsers?.length == 1 ? receiverUsers[0]?.avatar_url : null}
          alt=""
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 text-left">
        <div className="flex-1 text-xl font-bold">
          {receiverUsers?.length === 1
            ? receiverUsers[0]?.full_name
            : conversation.title}
        </div>
        <div className="flex-1 text-base text-gray-500">
          {lastMessage
            ? lastMessage.status === "deleted"
              ? "This message was deleted"
              : lastMessage.length > 30
              ? `${lastMessage.slice(0, 30)}...`
              : lastMessage
            : "No messages yet"}
        </div>
        <div className="flex-1 text-[0.875rem] text-gray-500">
          {lastUpdate
            ? new Intl.DateTimeFormat("en-GB", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(lastUpdate)
            : "No date available"}
        </div>
      </div>
    </button>
  );
}
