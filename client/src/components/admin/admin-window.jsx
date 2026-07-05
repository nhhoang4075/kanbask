"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import AdminDashboard from "@/components/admin/admin-dashboard";
import AdminUsersTable from "@/components/admin/admin-users-table";
import AdminTeamsTable from "@/components/admin/admin-teams-table";
import AdminProjectsTable from "@/components/admin/admin-projects-table";
import AdminHealthPanel from "@/components/admin/admin-health-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminWindow() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "dashboard";

  const changeTab = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full h-full bg-white">
      <Tabs value={tab} onValueChange={changeTab} className="w-full h-full bg-white">
        <TabsList className="justify-start w-full px-6 gap-x-6 rounded-none border-b bg-white">
          <TabsTrigger
            value="dashboard"
            className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="teams"
            className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            Teams
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="health"
            className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
          >
            Health
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="w-full h-[calc(98vh-100px)]">
          <TabsContent value="dashboard" className="m-0">
            <div className="w-full p-6 space-y-4">
              <AdminDashboard />
            </div>
          </TabsContent>
          <TabsContent value="users" className="m-0">
            <div className="w-full p-6 space-y-4">
              <AdminUsersTable />
            </div>
          </TabsContent>
          <TabsContent value="teams" className="m-0">
            <div className="w-full p-6 space-y-4">
              <AdminTeamsTable />
            </div>
          </TabsContent>
          <TabsContent value="projects" className="m-0">
            <div className="w-full p-6 space-y-4">
              <AdminProjectsTable />
            </div>
          </TabsContent>
          <TabsContent value="health" className="m-0">
            <div className="w-full p-6 space-y-4">
              <AdminHealthPanel />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
