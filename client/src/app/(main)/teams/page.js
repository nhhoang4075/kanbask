"use client";

import MemberSideBar from "@/components/Teams/TeamSideBar";
import MembersTable from "@/components/Teams/MemberView/MembersTable";
import TeamsNavbar from "@/components/Teams/TeamsNavbar";
import ProjectsTable from "@/components/Teams/ProjectView/ProjectsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsData, teams } from "@/data/teams";
import { set } from "date-fns";
import React, { useState } from "react";

const Teams = () => {
  // showData is used to show teams or project
  const [showData, setShowData] = useState("team");
  // teamShow is used to show the team or project selected in Member view
  const [teamShow, setTeamShow] = useState(teams[0]);
  // project is used to show the project selected in Project view
  const [project, setProject] = useState(projectsData[0]);

  const [activeTab, setActiveTab] = useState("members");

  const props = {
    showData,
    setShowData,
    teamShow,
    setTeamShow,
    project,
    setProject
  };

  return (
    <div className="w-full grid grid-cols-9 overflow-y-auto border-l-2 border-gray-300 bg-slate-50">
      <MemberSideBar props={props} />
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
        <TabsContent value="members" className="w-full mt-0 overflow-hidden">
          <MembersTable props={props} />
        </TabsContent>
        <TabsContent value="projects" className="mt-0">
          <ProjectsTable props={props} view={"teams"} />
        </TabsContent>
        <TabsContent value="all-projects" className="mt-0">
          <ProjectsTable props={props} view={"all"} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teams;
