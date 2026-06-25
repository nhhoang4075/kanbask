"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import TeamSideBar from "@/components/team/teams-ui/team-sidebar";
import MembersTable from "@/components/team/member-view/member-main";
import ProjectsTable from "@/components/team/project-view/project-main";
import { TeamDetailSheet } from "./member-view/team-details-sheet";
import { ProjectDetailSheet } from "./project-view/project-detail-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTeam } from "@/hooks/use-team";

export default function TeamsMain() {
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
    <div className="w-full max-h-[calc(100vh-4rem)] p-0 overflow-hidden rounded-b-2xl">
      <div className="w-full h-full grid grid-cols-9 border-gray-300">
        <TeamSideBar />
        <div className="w-full col-span-7">
          {teams.length ? (
            <>
              <Tabs value={tab} onValueChange={changeTab} className="w-full h-full bg-white">
                <TabsList className="justify-start w-full px-6 gap-x-4 rounded-none border-b bg-white">
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
                    value="all-projects"
                    className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
                  >
                    All Projects
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="members">
                  <MembersTable />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectsTable view={"teams"} />
                  <div>Projects</div>
                </TabsContent>
                <TabsContent value="all-projects">
                  {/* <ProjectsTable view={"all"} /> */}
                  <div>All Projects</div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            // (
            //   <div className="flex flex-col text-center h-[80%] justify-center bg-white">
            //     <div className="flex flex-row gap-2 w-full h-auto justify-start py-2 px-3 bg-blue-100 rounded-none">
            //       <Button
            //         className={cn(
            //           "bg-white hover:bg-gray-200 border-2 border-white",
            //           activeTab == "members" ? "text-black" : "text-gray-400"
            //         )}
            //         onClick={() => setActiveTab("members")}
            //       >
            //         Members
            //       </Button>
            //       <Button
            //         className={cn(
            //           "bg-white hover:bg-gray-200 border-2 border-white",
            //           activeTab == "projects" ? "text-black" : "text-gray-400"
            //         )}
            //         onClick={() => setActiveTab("projects")}
            //       >
            //         Projects
            //       </Button>
            //       <Button
            //         className={cn(
            //           "bg-white hover:bg-gray-200 border-2 border-white",
            //           activeTab == "all-projects" ? "text-black" : "text-gray-400"
            //         )}
            //         onClick={() => setActiveTab("all-projects")}
            //       >
            //         All Projects
            //       </Button>
            //     </div>

            //     {activeTab == "members" && <MembersTable />}
            //     {activeTab == "projects" && <ProjectsTable view={"teams"} />}
            //     {activeTab == "all-projects" && <ProjectsTable view={"all"} />}
            //   </>
            // )
            <div className="flex flex-col justify-center h-full bg-white">
              <p className="text-lg text-center text-muted-foreground">
                Join or create a team to continue
              </p>
            </div>
          )}
        </div>
      </div>
      <TeamDetailSheet />
      <ProjectDetailSheet />
    </div>
  );
}
