import { cookies } from "next/headers";

import { SessionProvider } from "@/hooks/use-session";
import { SocketProvider } from "@/hooks/use-socket";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app/app-sidebar";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SessionProvider>
      <SocketProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
