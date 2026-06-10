"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  MessageSquareDot,
  Calendar1,
  SquareCheckBig,
  UsersIcon
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
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
    url: "#",
    icon: Calendar1
  },
  {
    title: "Tasks",
    url: "/app/tasks",
    icon: SquareCheckBig
  },
  {
    title: "Team",
    url: "/app/teams",
    icon: UsersIcon
  }
];

export default function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url === pathname;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={isActive} tooltip={item.title} asChild>
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
