"use client";

import { useRef } from "react";
import { Bell } from "lucide-react";

import NotificationHeader from "@/components/notification/notification-header";
import NotificationContent from "@/components/notification/notification-content";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNotification } from "@/hooks/use-notification";
import { cn } from "@/lib/utils";

export default function NotificationButton() {
  const buttonRef = useRef(null);
  const { unreadCount } = useNotification();
  const { open: sidebarOpen } = useSidebar();

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <SidebarMenuButton
            ref={buttonRef}
            className="relative flex items-center justify-center w-8 h-8 p-0 bg-white text-prussian-blue overflow-visible"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                className={cn(
                  "absolute -top-3 -right-3 text-xs bg-mustard text-prussian-blue rounded-sm",
                  unreadCount > 9 ? "px-0.5" : "px-1.5"
                )}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </SidebarMenuButton>
        </PopoverTrigger>
        <PopoverContent
          side={sidebarOpen ? "bottom" : "right"}
          align="start"
          sideOffset={sidebarOpen ? 10 : 16}
          alignOffset={sidebarOpen ? -50 : 0}
          className="w-[400px] p-0 rounded-md"
          ref={buttonRef}
        >
          <NotificationHeader />
          <NotificationContent />
        </PopoverContent>
      </Popover>
    </div>
  );
}
