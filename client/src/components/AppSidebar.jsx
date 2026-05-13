"use client";

import { usePathname } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Home,
	MessageSquare,
	Calendar,
	CheckSquare,
	Users,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
	{ name: "Dashboard", href: "/dashboard", icon: Home },
	{ name: "Message", href: "/message", icon: MessageSquare },
	{ name: "Calendar", href: "/calendar", icon: Calendar },
	{ name: "Tasks", href: "/tasks", icon: CheckSquare },
	{ name: "Teams", href: "/teams/members", icon: Users },
];

export default function AppSidebar({ isCollapsed, setIsCollapsed }) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const param = searchParams.toString();

	const { toggleSidebar } = useSidebar();
	const handleToggleSidebar = () => {
		setIsCollapsed(!isCollapsed);
		toggleSidebar();
	};

	return (
		<Sidebar
			collapsible="icon"
			className="relative w-50 h-[calc(100vh-50px)]"
		>
			<SidebarContent className="bg-prussian-blue">
				<SidebarMenu className="flex flex-col space-y-2 items-center px-2 py-2">
					<SidebarTrigger
						className="self-start bg-transparent text-white hover:bg-white hover:text-black"
						onClick={handleToggleSidebar}
					/>
					{navItems.map((item) => (
						<SidebarMenuButton
							key={item.name}
							className={cn(
								"w-full px-4 py-5.5 text-base justify-start bg-transparent text-white hover:bg-white hover:text-black hover:cursor-pointer",
								pathname === item.href && "bg-white text-black"
							)}
							onClick={() => {
								router.push(
									item.href + (param ? `?${param}` : "")
								);
							}}
							isActive={item.isActive}
						>
							<item.icon className="w-6 h-6 mr-2" />
							<span className="text-base font-bold">
								{item.name}
							</span>
						</SidebarMenuButton>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
}
