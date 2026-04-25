"use client";

import { ChatSidebar } from '@/components/ChatSidebar';
import { Separator } from "@/components/ui/separator";
import { Chat } from '@/components/Chat';
//import conversations from '@/data/conversations';
import { useState } from 'react';

export default function Message() {
    const conversations = [];
    const [currConv, setCurrConv] = useState(conversations[0]);
    return (
        <div className="flex h-screen bg-gray-200 rounded-md dark:bg-black">
            <div className="flex-1">
                <h1>Message</h1>
                {
                //<ChatSidebar setCurrConv={setCurrConv}/>
                }
            </div>
            <Separator orientation="vertical" className="flex-none w-px pl-px"/>
            {
            //<Chat currConv={currConv}/>
            }
        </div>
    )
}