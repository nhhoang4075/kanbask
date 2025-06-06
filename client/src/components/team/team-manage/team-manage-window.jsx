"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import TeamMemberTable from "@/components/team/team-manage/team-member-table";
import TeamProjectTable from "@/components/team/team-manage/team-project-table";
import TeamRequestTable from "@/components/team/team-manage/team-request-table";
import TeamInformationCard from "@/components/team/team-manage/team-infomation-card";
import TeamInvitationCard from "@/components/team/team-manage/team-invitation-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTeam } from "@/hooks/use-team";

export default function TeamManageWindow() {
  const { teams } = useTeam();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "members";

  const changeTab = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full h-full bg-white">
      {teams.length ? (
        <>
          <Tabs value={tab} onValueChange={changeTab} className="w-full h-full bg-white">
            <TabsList className="justify-start w-full px-6 gap-x-6 rounded-none border-b bg-white">
              <TabsTrigger
                value="members"
                className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="invitations"
                className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
              >
                Invitations
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="w-full h-[calc(98vh-100px)]">
              <TabsContent value="members" className="m-0">
                <div className="w-full p-6 space-y-4">
                  <TeamInformationCard />
                  <TeamMemberTable />
                </div>
              </TabsContent>
              <TabsContent value="projects" className="m-0">
                <div className="w-full p-6 space-y-4">
                  <TeamInformationCard />
                  <TeamProjectTable />
                </div>
              </TabsContent>
              <TabsContent value="invitations" className="m-0">
                <div className="w-full p-6 space-y-4">
                  <TeamInvitationCard />
                  <TeamRequestTable />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </>
      ) : (
        <div className="flex flex-col justify-center h-full bg-white">
          <p className="text-lg text-center text-muted-foreground">
            Join or create a team to continue
          </p>
        </div>
      )}
    </div>
  );
}
