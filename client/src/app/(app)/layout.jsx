import { cookies } from "next/headers";

import { SessionProvider } from "@/hooks/use-session";
import { SocketProvider } from "@/hooks/use-socket";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app/app-sidebar";
import Header from "@/components/app/header";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SessionProvider>
      <SocketProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <main className="flex-1 min-h-[90dvh] bg-prussian-blue">
              <Header />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
