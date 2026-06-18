"use client";

import MemberSideBar from "@/components/Teams/teams-ui/TeamSideBar";
import MembersTable from "@/components/Teams/MemberView/MembersTable";
import ProjectsTable from "@/components/Teams/ProjectView/ProjectsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { useTeamContext } from "@/hooks/use-teams";
import { TeamDetailSheet } from "./teams-ui/TeamDetailSheet";
import { ProjectDetailSheet } from "./ProjectView/ProjectDetailSheet";

const Teams = () => {
  const { activeTab, setActiveTab } = useTeamContext();

  return (
    <div className="w-full max-h-[calc(100vh-4rem)] p-0 overflow-hidden rounded-b-2xl">
      <div className="w-full h-full grid grid-cols-9 border-gray-300 bg-slate-50">
        <MemberSideBar />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full col-span-7">
          <TabsList className="flex flex-row gap-2 w-full h-auto justify-start py-2 px-3 bg-gray-200 rounded-none">
            <TabsTrigger className="bg-white" value="members">
              Members
            </TabsTrigger>
            <TabsTrigger className="bg-white" value="projects">
              Projects
            </TabsTrigger>
            <TabsTrigger className="bg-white" value="all-projects">
              All Projects
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="w-full overflow-hidden">
            <MembersTable />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsTable view={"teams"} />
          </TabsContent>
          <TabsContent value="all-projects">
            <ProjectsTable view={"all"} />
          </TabsContent>
        </Tabs>
      </div>
      <TeamDetailSheet edit={true} />
      <ProjectDetailSheet edit={true} />
    </div>
  );
};

export default Teams;
