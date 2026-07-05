"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  MessageSquareDot,
  Calendar1,
  SquareCheckBig,
  UsersIcon,
  ShieldIcon
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/app",
    icon: LayoutDashboardIcon
  },
  {
    title: "Message",
    url: "/app/message",
    icon: MessageSquareDot
  },
  {
    title: "Calendar",
    url: "/app/calendar",
    icon: Calendar1
  },
  {
    title: "Task",
    url: "/app/task",
    icon: SquareCheckBig
  },
  {
    title: "Team",
    url: "/app/team",
    icon: UsersIcon
  },
  {
    title: "Admin",
    url: "/app/admin",
    icon: ShieldIcon,
    adminOnly: true
  }
];

export default function NavMain() {
  const pathname = usePathname();
  const { user } = useSession();

  const visibleItems = items.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <SidebarGroup>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const isActive =
            item.url === "/app" ? pathname === item.url : pathname.includes(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.title}
                asChild
                className={cn(
                  "hover:bg-mustard active:bg-mustard hover:text-prussian-blue active:text-prussian-blue transition-all duration-200 ease-in-out rounded-sm",
                  "data-[active=true]:bg-mustard data-[active=true]:text-prussian-blue"
                )}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className={cn(isActive && "text-blue-green")} />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
