/**
 * ChatHeader component displays the header for a chat conversation.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.currUser - The ID of the current user.
 * @param {Object} props.currConv - The current conversation object.
 * @param {Array} props.currConv.participants - Array of participant IDs in the current conversation.
 * @param {string} props.currConv.title - The title of the current conversation (used for group chats).
 * @param {Array} props.users - Array of user objects.
 * @param {string} props.users[].id - The ID of a user.
 * @param {string} props.users[].fullname - The full name of a user.
 * @param {string} props.users[].avatar_url - The avatar URL of a user.
 * @returns {JSX.Element} The rendered ChatHeader component.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default function ChatHeader({ currUser, currConv, users}) {
    // Get the receiver user(s) for the current conversation
    const receiverUsers = currConv.participants
        .filter(id => id !== currUser)
        .map(id => users.find(user => user.id === id));

    return (
        <Card className="flex-none bg-neutral-200 dark:bg-black py-2">
            <CardContent className="flex w-full gap-3">
                <Avatar className="flex-none size-10">
                    <AvatarImage src={receiverUsers.length == 1 ? receiverUsers[0]?.avatar_url : null} alt=""/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-none text-3xl font-bold">
                    {receiverUsers.length == 1 ? receiverUsers[0]?.fullname : currConv.title}
                </div>
            </CardContent>
        </Card>
    )
}