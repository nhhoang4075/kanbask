import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }) {
	return (
		<div className="grid grid-rows-[60px_auto] h-screen w-screen gap-2 bg-gray-100 dark:bg-gray-900">
			<AppHeader className="flex-none" />
			<div className="flex flex-1 gap-2 overflow-hidden dark:bg-gray-900 max-h-[calc(100vh-75px)]">
				<SidebarProvider className="relative flex-none w-64 ">
					<AppSidebar />
				</SidebarProvider>
				<div className="relative flex-1 bg-gray-100 dark:bg-gray-900 h-full">
					{children}
				</div>
			</div>
		</div>
	);
}
