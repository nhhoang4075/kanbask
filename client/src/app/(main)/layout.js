"use client";

import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }) {
    
    return (
        <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            <AppHeader className="flex-none" />
            <SidebarProvider defaultOpen={false} className="flex flex-1 overflow-hidden dark:bg-gray-900">
                <AppSidebar className="relative flex-none w-64 overflow-hidden" />
                <SidebarInset className="flex-1 overflow-hidden p-2 ml-16 mt-2 h-[calc(100dvh-70px)]">
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}