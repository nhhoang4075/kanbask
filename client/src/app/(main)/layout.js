"use client";

import AppSidebar from '@/components/AppComponents/AppSidebar';
import AppHeader from '@/components/AppComponents/AppHeader';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { use, useState } from 'react';
import { SocketProvider } from '@/hooks/use-socket';
import { ChatDataProvider } from '@/hooks/use-chatdata';

export default function Layout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    return (
        <SocketProvider>
            <ChatDataProvider>
                {!isCollapsed && <div className="absolute top-19 left-0 h-[calc(100dvh-76px)] w-[100vw] overflow-hidden z-25 bg-black/75"></div>}
                <div className="h-[100dvh] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <SidebarProvider defaultOpen={false} className="flex flex-col overflow-hidden dark:bg-gray-900" style={{"--sidebar-width-icon": "4rem"}}>
                        <AppHeader className="fixed flex-none z-25" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
                        <div className="flex flex-1 overflow-hidden">
                            <AppSidebar className="flex-1 overflow-hidden" setisCollapsed={setIsCollapsed}/>
                            <SidebarInset className="flex-1 overflow-hidden mt-2 h-[calc(100dvh-70px)] sm:ml-16">
                                    {children}
                            </SidebarInset>
                        </div>
                    </SidebarProvider>
                </div>
            </ChatDataProvider>
        </SocketProvider>
    );
}