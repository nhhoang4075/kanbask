"use client";

import { Sidebar, SidebarClose, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/sidebar";

export default function AppHeader({ isCollapsed, setIsCollapsed }) {
  const { toggleSidebar } = useSidebar();
  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    toggleSidebar();
  };
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
      <h1 className="flex-4/5 text-2xl font-bold">Kanbask</h1>
      <div className="flex-1/5 flex items-center justify-end gap-4">
        <Button className="flex-none hover:bg-gray-300" variant="ghost">
          <Bell />
        </Button>
        <Input
          type="text"
          placeholder="Search..."
          className="bg-gray-100 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </header>
  );
}
