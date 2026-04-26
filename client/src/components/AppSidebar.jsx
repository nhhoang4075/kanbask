"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, MessageSquare, Calendar, CheckSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent} from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";

export default function AppSidebar() {
    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Message", href: "/message", icon: MessageSquare },
        { name: "Calendar", href: "/calendar", icon: Calendar },
        { name: "Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Teams", href: "/teams", icon: Users },
    ];
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const param = searchParams.toString();
    return (
        <Sidebar className="relative">
            <SidebarContent className="w-64 bg-gray-200 rounded-md">
                <ScrollArea>
                    <div className="flex flex-col space-y-2 p-4">
                        {navItems.map((item) => (
                            <Button key={item.name} 
                                    className={cn("w-full bg-white text-black justify-start text-left hover:bg-gray-400", pathname === item.href && "bg-gray-400")}
                                    onClick={() => {
                                        router.push(item.href + (param ? `?${param}` : ""));}}
                                >
                                <item.icon className="mr-2 h-5 w-5" />
                                {item.name}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </SidebarContent>
        </Sidebar>
    );
}