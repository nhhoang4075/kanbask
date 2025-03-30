import AppSidebar from '@/components/AppSidebar';
import AppHeader from '@/components/AppHeader';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            <AppHeader className="flex-none" />
            <div className="flex flex-1 overflow-hidden dark:bg-gray-900">
                <SidebarProvider className="flex-none w-64 overflow-hidden">
                    <AppSidebar />
                </SidebarProvider>
                <div className="flex-1 overflow-hidden p-2">
                    {children}
                </div>
            </div>
        </div>
    );
}