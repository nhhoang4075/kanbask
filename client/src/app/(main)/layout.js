import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col h-screen w-screen gap-2 bg-gray-100 dark:bg-gray-900">
            <AppHeader className="flex-none"/>
            <div className="flex flex-1 gap-2 overflow-hidden dark:bg-gray-900">
                <SidebarProvider className="flex-none w-64">
                    <AppSidebar />
                </SidebarProvider>
                <div className="flex-1 bg-gray-100 dark:bg-gray-900">
                    {children}
                </div>
            </div>
        </div>
    );
}