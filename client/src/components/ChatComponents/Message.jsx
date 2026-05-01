/**
 * Message component renders a single chat message with proper formatting,
 * including sender information, timestamps, and message grouping based on
 * the sender and date.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Object} props.message - The message object containing details about the message.
 * @param {string} props.message.senderId - The ID of the sender of the message.
 * @param {string} props.message.content - The content of the message.
 * @param {string} props.message.createdAt - The timestamp when the message was created.
 * @param {Array<Object>} props.users - The list of users in the conversation.
 * @param {string} props.users[].id - The ID of a user.
 * @param {string} [props.users[].avatar_url] - The avatar URL of a user.
 * @param {Array<Object>} props.conversationMessages - The list of all messages in the conversation.
 * @param {Object} props.currUser - The ID of the current user.
 *
 * @returns {JSX.Element|null} The rendered message component or null if the message or sender is invalid.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Message({ message, users, conversationMessages, currUser }) {
    console.log("Message: ", message);
    if (!message) return null;
    const sender = users.find(user => user.id === message.senderId);
    if (!sender) return null;

    // Check if the previous message is from the same sender and on the same date
    const prevMessage = conversationMessages[conversationMessages.indexOf(message) - 1];
    const prevIsSameSender = prevMessage && prevMessage.senderId === message.senderId;
    const prevIsSameDate = prevMessage && new Date(prevMessage.createdAt).toDateString() === new Date(message.createdAt).toDateString();

    // Check if the next message is from the same sender and on the same date
    const nextMessage = conversationMessages[conversationMessages.indexOf(message) + 1];
    const nextIsSameSender = nextMessage && nextMessage.senderId === message.senderId;
    const nextIsSameDate = nextMessage && new Date(nextMessage.createdAt).toDateString() === new Date(message.createdAt).toDateString();

    return (
        <>
            {(!prevIsSameDate) ? (
                <div className="w-full py-2 text-sm text-gray-500 text-center">
                    {new Date(message.createdAt).toLocaleDateString()}
                </div>
            ) : null}
            <div className={cn("flex py-2 gap-2", 
                sender.id === currUser ? "justify-end" : "justify-start")}>
                <div className={cn("flex mx-2 gap-2", sender.id !== currUser ? "flex-row" : "flex-row-reverse")}>
                    {(message.senderId !== currUser && !prevIsSameSender) ? (
                        <Avatar className="flex-none">
                            <AvatarImage src={sender.avatar_url ? sender.avatar_url : null} alt="" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    ) : <div className="flex-none w-8"></div>}
                    <div
                        className="flex items-center p-3 w-fit max-w-md h-fit rounded-md bg-amber-300 break-words"
                        style={{
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                        }}
                    >
                        {message.content}
                    </div>
                    {(!nextIsSameSender || (nextIsSameSender && !nextIsSameDate)) ? (
                        <div className="text-sm text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}