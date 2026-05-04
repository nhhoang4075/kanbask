"use client";

import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Layout({ children }) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	useEffect(() => {}, [isCollapsed]);

	return (
		<>
			<div className="h-[100dvh] w-full overflow-hidden bg-white dark:bg-gray-900">
				<AppHeader />
				<SidebarProvider className="grid grid-cols-[auto_1fr]">
					<div
						className={cn(
							"flex flex-col h-full",
							isCollapsed ? "w-16" : "w-55"
						)}
					>
						<AppSidebar
							isCollapsed={isCollapsed}
							setIsCollapsed={setIsCollapsed}
						/>
					</div>
					<SidebarInset>{children}</SidebarInset>
				</SidebarProvider>
			</div>
		</>
	);
}
