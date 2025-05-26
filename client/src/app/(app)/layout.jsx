import { cookies } from "next/headers";

import AppSidebar from "@/components/app/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SessionProvider } from "@/hooks/use-session";
import { SocketProvider } from "@/hooks/use-socket";
import { SearchProvider } from "@/hooks/use-search";
import { ChatProvider } from "@/hooks/use-chat";
import { CalendarProvider } from "@/hooks/use-calendar";
import { NotificationProvider } from "@/hooks/use-notification";
import { getConversations } from "@/actions/conversation-actions";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const data = await getConversations();

  return (
    <SessionProvider>
      <SocketProvider>
        <CalendarProvider>
          <NotificationProvider>
            <ChatProvider initialConversations={data.conversations}>
              <SidebarProvider defaultOpen={defaultOpen}>
                <SearchProvider>
                  <AppSidebar variant="inset" />
                  <SidebarInset>
                    <main className="flex-1 min-h-[95dvh] bg-prussian-blue">{children}</main>
                  </SidebarInset>
                </SearchProvider>
              </SidebarProvider>
            </ChatProvider>
          </NotificationProvider>
        </CalendarProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
