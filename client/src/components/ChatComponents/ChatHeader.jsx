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
import { getParticipantsOfConversation } from "@/lib/ConversationActions"
import { getOneUserById } from "@/lib/UserActions"
import { useEffect, useState } from "react"

const getUser = async (userId) => {
    const user = await getOneUserById(userId);
    return user;
}

export default function ChatHeader({ currConv, currentUserId }) {
    const [participants, setParticipants] = useState([])
    const [receiverUsers, setReceiverUsers] = useState([])
    useEffect(() => {
        const fetchParticipants = async () => {
            const participants = await getParticipantsOfConversation(currConv.id)
            setParticipants(participants)
        }
        fetchParticipants()
    }, [currConv.id]);
    // Get the receiver user(s) for the current conversation
    useEffect(() => {
        const fetchUsers = async () => {
            const filtered = participants?.filter(user => user.user_id !== currentUserId);
            const receiverUsers = await Promise.all(filtered.map(user => getUser(user.user_id)));
            setReceiverUsers(receiverUsers);
        };
        fetchUsers();
    }, [participants, currentUserId]);
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