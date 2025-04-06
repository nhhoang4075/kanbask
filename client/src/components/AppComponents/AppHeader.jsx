/**
 * AppHeader Component
 *
 * This component renders the header section of the application.
 * It includes the application title, a notification button, and a search input field.
 *
 * @component
 * @returns {JSX.Element} The rendered AppHeader component.
 *
 * @example
 * // Usage example:
 * import AppHeader from './AppHeader';
 *
 * function App() {
 *   return (
 *     <div>
 *       <AppHeader />
 *     </div>
 *   );
 * }
 *
 * @dependencies
 * - Button: A reusable button component imported from "./ui/button".
 * - Input: A reusable input component imported from "./ui/input".
 * - Bell: An icon component imported from "lucide-react" for the notification button.
 *
 * @styles
 * - The component uses Tailwind CSS classes for styling.
 * - Supports dark mode with `dark:bg-gray-800` and `dark:text-white` classes.
 */
"use client";

import { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Bell } from "lucide-react";
import { Sidebar, SidebarClose } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export default function AppHeader({ isCollapsed, setIsCollapsed }) {
    const { toggleSidebar } = useSidebar();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false); // State for notification visibility
    const notificationRef = useRef(null); // Ref for the notification dropdown

    const handleToggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        toggleSidebar();
    };

    const navigateToDashboard = () => {
        router.push("/dashboard");
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications); // Toggle notification visibility
    };

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="flex p-4 w-full items-center shadow-md dark:bg-gray-800 dark:text-white">
            <Button
                variant="ghost"
                className="flex-none mr-4"
                onClick={handleToggleSidebar}
                aria-label="Toggle Sidebar"
                title="Toggle Sidebar"
                data-tooltip-id="tooltip"
                size="icon"
            >
                {isCollapsed ? <Sidebar /> : <SidebarClose />}
            </Button>
            <button
                onClick={navigateToDashboard}
                className="flex-4/5 text-2xl font-bold text-left"
                aria-label="Go to Dashboard"
            >
                Kanbask
            </button>
            <div className="flex-1/5 flex items-center justify-end gap-4 relative">
                <Button
                    className="flex-none hover:bg-gray-300"
                    variant="ghost"
                    onClick={toggleNotifications} // Add onClick to toggle notifications
                    aria-label="Show Notifications"
                >
                    <Bell />
                </Button>
                {showNotifications && (
                    <div
                        ref={notificationRef} // Attach ref to the notification dropdown
                        className="fixed top-16 right-4 w-64 bg-white shadow-lg rounded-md p-4 dark:bg-gray-700 border border-black z-[9999]"
                    >
                        <p className="text-sm font-medium dark:text-white">
                            You have no new notifications.
                        </p>
                    </div>
                )}
                <Input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-100 dark:bg-gray-700 dark:text-white"
                />
            </div>
        </header>
    );
}