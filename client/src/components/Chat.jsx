"use client";

import { useSearchParams } from "next/navigation";
import { ScrollArea } from "./ui/scroll-area";
import users from "@/data/users";
import messages from "@/data/messages";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function Chat({ currConv }) {
    const searchParams = useSearchParams();
    const currUser = searchParams.get("userId");
    const chatConainerRef = useRef(null);
    const scrollToBottom = () => {
        chatConainerRef.current.scrollIntoView(false);
    }
    useEffect(() => {
        scrollToBottom();
    }, [currConv]);
    const [mess, setMess] = useState(null);
    const handleSendMessage = () => {
        const newMessage = {
            id: messages.length + 1,
            conversationId: currConv.id,
            senderId: parseInt(currUser),
            content: mess,
            createAt: new Date().toISOString(),
        };
        console.log(newMessage);
        messages.push(newMessage);
        currConv.messagesId.push(newMessage.id);
        setMess("");
        scrollToBottom();
    }
    const receiverUser = users.find(user => user.id === currConv.participantsId.find(id => id !== parseInt(currUser)));
    return (
        <div className="flex flex-col flex-1 p-2 dark:bg-black">
            <Card className="bg-amber-100 py-4">
                <CardContent className="flex w-full gap-3">
                    <Avatar className="flex-none size-10">
                        <AvatarImage src={receiverUser.avatar_url} alt=""/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-3xl font-bold">
                        {receiverUser.name}
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-1 w-full my-2 bg-amber-100">
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-15rem)]" >
                        <div className="flex flex-col" ref={chatConainerRef}>
                            {currConv.messagesId.map(messageId => {
                                const message = messages.find(message => message.id === messageId);
                                const sender = users.find(user => user.id === message.senderId);
                                return (
                                    <div key={message.id} className={cn("flex py-8 gap-2 ", sender.id === parseInt(currUser) ? "justify-end" : "justify-start")}>
                                        <div className="flex mx-6 gap-2 items-center">
                                            {message.senderId !== parseInt(currUser) && (
                                                <Avatar className="flex-none">
                                                    <AvatarImage src={sender.avatar_url} alt="" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex-1 px-6 w-fit h-15 rounded-md bg-amber-300">
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
            
            <div className="flex items-center gap-2">
                <Input type="text" placeholder="Type a message" className="flex-1 p-2 h-15" value={mess || ""} onChange={(e) => {setMess(e.target.value)}}/>
                <Button className="flex-none" onClick={handleSendMessage}>Send</Button>
            </div>
        </div>
    )
}