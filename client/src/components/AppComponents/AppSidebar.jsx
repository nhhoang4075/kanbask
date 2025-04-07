/**
 * AppSidebar Component
 *
 * This component renders a collapsible sidebar navigation menu for the application.
 * It dynamically generates navigation buttons based on the `navItems` array, allowing
 * users to navigate to different routes while preserving query parameters if present.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.setisCollapsed - Function to update the collapsed state of the sidebar.
 * @returns {JSX.Element} The rendered AppSidebar component.
 *
 * @example
 * <AppSidebar setisCollapsed={setCollapsedState} />
 *
 * @dependencies
 * - `next/navigation`: Provides `usePathname`, `useRouter`, and `useSearchParams` hooks for navigation.
 * - `lucide-react`: Provides icons for the navigation items.
 * - `@/components/ui/scroll-area`: Scrollable container for the sidebar content.
 * - `@/components/ui/sidebar`: Sidebar and SidebarContent components for layout.
 * - `@/lib/utils`: Utility function `cn` for conditional class names.
 *
 * @hooks
 * - `usePathname`: Retrieves the current pathname.
 * - `useRouter`: Provides navigation methods like `router.push`.
 * - `useSearchParams`: Retrieves the current query parameters.
 * - `useSidebar`: Manages the sidebar's open/close state.
 *
 * @state
 * - `navItems`: Array of navigation items, each containing:
 *   - `name` (string): The display name of the navigation item.
 *   - `href` (string): The route path for the navigation item.
 *   - `icon` (React.Component): The icon component for the navigation item.
 *
 * @styles
 * - The sidebar is collapsible and styled with a gray background and rounded corners.
 * - Buttons are styled with conditional classes to indicate the active route.
 * - Hover effects are applied to buttons for better user experience.
 * - The sidebar expands on hover and collapses when the mouse leaves.
 */
"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, MessageSquare, Calendar, CheckSquare, Users, LogOut, CircleUserRound } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter, useSearchParams } from "next/navigation";

// Define the navigation items with their names, hrefs, and icons
const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Message", href: "/message", icon: MessageSquare },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Profile", href: "/profile", icon: CircleUserRound }, // New button added here
];

export default function AppSidebar({ setisCollapsed, ...props }) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const param = searchParams.toString();

    return (
        <div className="relative h-full overflow-hidden">
            <div className="fixed inset-y-0 z-50">
                <div className="absolute top-19 left-0 h-full">
                    <Sidebar collapsible="icon" {...props} className="absolute top-0 left-0 w-56 h-full z-50">
                        <SidebarContent className="bg-gray-200 rounded-md">
                            <ScrollArea className="h-full">
                                <SidebarMenu className="flex flex-col space-y-2 p-4">
                                    {navItems.map((item) => (
                                        <SidebarMenuButton
                                            key={item.name}
                                            className={cn(
                                                "transition-all duration-200 rounded-md",
                                                "bg-white text-black hover:bg-gray-300",
                                                pathname === item.href && "bg-gray-300 text-black",
                                            )}
                                            onClick={() => {
                                                router.push(item.href + (param ? `?${param}` : ""));
                                            }}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.name}</span>
                                        </SidebarMenuButton>
                                    ))}
                                </SidebarMenu>
                            </ScrollArea>
                        </SidebarContent>
                    </Sidebar>
                </div>
            </div>
        </div>
    );
}