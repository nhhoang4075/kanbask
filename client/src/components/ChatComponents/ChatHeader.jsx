import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default function ChatHeader({ currUser, currConv, users }) {
    // Get the receiver user(s) for the current conversation
    const receiverUsers = currConv.participants
        .filter(id => id !== currUser)
        .map(id => users.find(user => user.id === id));

    return (
        <Card className="flex-none bg-amber-100 py-4">
            <CardContent className="flex w-full gap-3">
                <Avatar className="flex-none size-10">
                    <AvatarImage src={receiverUsers.length == 1 ? receiverUsers[0].avatar_url : null} alt=""/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-3xl font-bold">
                    {receiverUsers.length == 1 ? receiverUsers[0].fullname : currConv.title}
                </div>
            </CardContent>
        </Card>
    )
}