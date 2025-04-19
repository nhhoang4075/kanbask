"use client";

import Link from "next/link";
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

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboardIcon
  },
  {
    title: "Message",
    url: "#",
    icon: MessageSquareDot
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar1
  },
  {
    title: "Tasks",
    url: "#",
    icon: SquareCheckBig
  },
  {
    title: "Team",
    url: "#",
    icon: UsersIcon
  }
];

export default function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
