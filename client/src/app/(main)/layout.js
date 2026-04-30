"use client";

import AppSidebar from '@/components/AppComponents/AppSidebar';
import AppHeader from '@/components/AppComponents/AppHeader';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useState } from 'react';

export default function Layout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    return (
        <>
            {!isCollapsed && <div className="absolute top-0 left-0 h-[100dvh] w-[100dvw] overflow-hidden z-25 bg-black/75"></div>}
            <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                <AppHeader className="flex-none" />
                <SidebarProvider defaultOpen={false} className="flex flex-1 overflow-hidden dark:bg-gray-900" style={{"--sidebar-width-icon": "4rem"}}>
                    <AppSidebar className="relative flex-none w-64 overflow-hidden" setisCollapsed={setIsCollapsed}/>
                    <SidebarInset className="flex-1 overflow-hidden p-2 ml-16 mt-2 h-[calc(100dvh-70px)]">
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </>
    );
}