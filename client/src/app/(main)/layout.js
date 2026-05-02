"use client";

import AppSidebar from '@/components/AppComponents/AppSidebar';
import AppHeader from '@/components/AppComponents/AppHeader';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Layout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    // Clear convId when navigating away from message route
    useEffect(() => {
        if (!pathname.includes('/message') && searchParams.has('convId')) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('convId');
            router.replace(`${pathname}?${params.toString()}`, { shallow: true });
        }
    }, [pathname, router, searchParams]);
    return (
        <>
            {!isCollapsed && <div className="absolute top-19 left-0 h-[100dvh] w-[100dvw] overflow-hidden z-25 bg-black/75"></div>}
            <div className="h-[100dvh] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                <SidebarProvider defaultOpen={false} className="flex flex-col overflow-hidden dark:bg-gray-900" style={{"--sidebar-width-icon": "4rem"}}>
                    <AppHeader className="fixed flex-none z-25" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
                    <div className="flex flex-1 overflow-hidden">
                        <AppSidebar className="flex-1 overflow-hidden" setisCollapsed={setIsCollapsed}/>
                        <SidebarInset className="flex-1 overflow-hidden ml-16 mt-2 h-[calc(100dvh-70px)]">
                            {children}
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </>
    );
}