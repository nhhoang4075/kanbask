import NavHeader from "@/components/app/nav-header";
import NavMain from "@/components/app/nav-main";
import NavUser from "@/components/app/nav-user";
import SearchButton from "@/components/search/search-button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";

export default function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>

      <SidebarContent>
        <SearchButton />
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
