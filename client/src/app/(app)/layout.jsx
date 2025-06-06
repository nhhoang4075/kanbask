import { cookies } from "next/headers";

import AppSidebar from "@/components/app/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SessionProvider } from "@/hooks/use-session";
import { SocketProvider } from "@/hooks/use-socket";
import { SearchProvider } from "@/hooks/use-search";
import { TeamProvider } from "@/hooks/use-team";
import { ProjectProvider } from "@/hooks/use-project";
import { TaskProvider } from "@/hooks/use-task";
import { ChatProvider } from "@/hooks/use-chat";
import { NotificationProvider } from "@/hooks/use-notification";
import { Toaster } from "sonner";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SessionProvider>
      <SocketProvider>
        <NotificationProvider>
          <TeamProvider>
            <ProjectProvider>
              <TaskProvider>
                <ChatProvider>
                  <SidebarProvider defaultOpen={defaultOpen}>
                    <SearchProvider>
                      <AppSidebar variant="inset" />
                      <SidebarInset>
                        <main className="flex-1 min-h-[95dvh] bg-prussian-blue">{children}</main>
                      </SidebarInset>
                      <Toaster position="top-right" />
                    </SearchProvider>
                  </SidebarProvider>
                </ChatProvider>
              </TaskProvider>
            </ProjectProvider>
          </TeamProvider>
        </NotificationProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
