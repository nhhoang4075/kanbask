import Link from "next/link";
import { ArrowUpCircleIcon } from "lucide-react";
import NotificationButton from "@/components/ui/NotificationButton";

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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  }
};
const mockNotifications = [
  {
    id: 1,
    user_id: "user-uuid-1",
    title: "Bạn được mời vào nhóm mới",
    content: 'Nhóm "Frontend Team" đã mời bạn tham gia.',
    reference_type: "team",
    reference_id: 101,
    is_read: false,
    created_at: "2025-05-16T00:30:00+07:00"
  },
  {
    id: 2,
    user_id: "user-uuid-1",
    title: "Cập nhật tiến độ dự án",
    content: 'Hãy kiểm tra phần dự án "WebApp V2".',
    reference_type: "project",
    reference_id: 202,
    is_read: true,
    created_at: "2025-05-15T14:00:00+07:00"
  },
  {
    id: 3,
    user_id: "user-uuid-1",
    title: "Công việc mới được giao",
    content: "Bạn có 1 công việc mới trong Sprint 5.",
    reference_type: "task",
    reference_id: 303,
    is_read: false,
    created_at: "2025-05-12T08:45:00+07:00"
  },
  {
    id: 4,
    user_id: "user-uuid-1",
    title: "Công việc mới được giao",
    content: "Bạn có 1 công việc mới trong Sprint 5.",
    reference_type: "task",
    reference_id: 303,
    is_read: false,
    created_at: "2025-05-14T08:45:00+07:00"
  },
  {
    id: 5,
    user_id: "user-uuid-1",
    title: "Công việc mới được giao",
    content: "Bạn có 1 công việc mới trong Sprint 5.",
    reference_type: "task",
    reference_id: 303,
    is_read: false,
    created_at: "2025-05-01T08:45:00+07:00"
  }

];

export default function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/app">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Kanbask</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        
        <NotificationButton notifications={mockNotifications} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
