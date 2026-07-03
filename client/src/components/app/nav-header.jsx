"use client";

import Link from "next/link";
import Image from "next/image";

import KanbaskWhite from "~/kanbask-white.svg";
import NotificationButton from "@/components/notification/notification-button";

import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export default function NavHeader() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="mt-2">
        {open ? (
          <div className="flex items-center justify-between">
            <Link href="/app">
              <Image src={KanbaskWhite} alt="Kanbask Logo" width={160} priority />
            </Link>
            <NotificationButton />
          </div>
        ) : (
          <NotificationButton />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
