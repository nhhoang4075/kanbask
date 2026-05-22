import { cookies } from "next/headers";

import { SessionProvider } from "@/hooks/use-session";
import { SocketProvider } from "@/hooks/use-socket";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app/app-sidebar";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SessionProvider>
      <SocketProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <main className="flex-1 min-h-[calc(98vh)] bg-prussian-blue">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
