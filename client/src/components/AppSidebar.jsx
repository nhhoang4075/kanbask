/**
 * AppSidebar Component
 *
 * This component renders a sidebar navigation menu for the application.
 * It uses Next.js navigation hooks and dynamically generates navigation buttons
 * based on the provided `navItems` array. Each button navigates to a specific route
 * and preserves query parameters if present.
 *
 * @component
 * @returns {JSX.Element} The rendered AppSidebar component.
 *
 * @example
 * <AppSidebar />
 *
 * @dependencies
 * - `next/navigation`: Provides `usePathname`, `useRouter`, and `useSearchParams` hooks for navigation.
 * - `next/link`: Used for client-side navigation.
 * - `lucide-react`: Provides icons for the navigation items.
 * - `@/components/ui/button`: Custom Button component for styling.
 * - `@/components/ui/scroll-area`: Scrollable container for the sidebar content.
 * - `@/components/ui/sidebar`: Sidebar and SidebarContent components for layout.
 * - `@/lib/utils`: Utility function `cn` for conditional class names.
 *
 * @hooks
 * - `usePathname`: Retrieves the current pathname.
 * - `useRouter`: Provides navigation methods like `router.push`.
 * - `useSearchParams`: Retrieves the current query parameters.
 *
 * @state
 * - `navItems`: Array of navigation items, each containing:
 *   - `name` (string): The display name of the navigation item.
 *   - `href` (string): The route path for the navigation item.
 *   - `icon` (React.Component): The icon component for the navigation item.
 *
 * @styles
 * - The sidebar has a width of 64 and a gray background with rounded corners.
 * - Buttons are styled with conditional classes to indicate the active route.
 * - Hover effects are applied to buttons for better user experience.
 */
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