import Link from "next/link";
import Image from "next/image";

import KanbaskWhite from "~/kanbask-white.svg";
import { ArrowUpCircleIcon } from "lucide-react";
// import NotificationButton from "@/components/notification/notification-button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";
import NavMain from "@/components/app/nav-main";
import NavUser from "@/components/app/nav-user";

export default function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-0 hover:bg-transparent active:bg-transparent">
              <Link href="/app" className="flex items-center gap-2">
                <Image src={KanbaskWhite} alt="Kanbask Logo" width={160} priority />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        {/* <NotificationButton /> */}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
