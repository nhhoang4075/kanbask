"use client";

import TeamSideBar from "@/components/teams/teams-ui/team-sidebar";
import MembersTable from "@/components/teams/member-view/member-main";
import ProjectsTable from "@/components/teams/project-view/project-main";
import React from "react";
import { useTeamContext } from "@/hooks/use-teams";
import { TeamDetailSheet } from "./member-view/team-details-sheet";
import { ProjectDetailSheet } from "./project-view/project-detail-sheet";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Teams = () => {
  const { activeTab, setActiveTab, selectedTeam } = useTeamContext();

  return (
    <div className="w-full max-h-[calc(100vh-4rem)] p-0 overflow-hidden rounded-b-2xl">
      <div className="w-full h-full grid grid-cols-9 border-gray-300 bg-slate-50">
        <TeamSideBar />
        <div className="w-full col-span-7">
          {selectedTeam ? (
            <>
              <div className="flex flex-row gap-2 w-full h-auto justify-start py-2 px-3 bg-blue-100 rounded-none">
                <Button
                  className={cn(
                    "bg-white hover:bg-gray-200 border-2 border-white",
                    activeTab == "members" ? "text-black" : "text-gray-400"
                  )}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </Button>
                <Button
                  className={cn(
                    "bg-white hover:bg-gray-200 border-2 border-white",
                    activeTab == "projects" ? "text-black" : "text-gray-400"
                  )}
                  onClick={() => setActiveTab("projects")}
                >
                  Projects
                </Button>
                <Button
                  className={cn(
                    "bg-white hover:bg-gray-200 border-2 border-white",
                    activeTab == "all-projects" ? "text-black" : "text-gray-400"
                  )}
                  onClick={() => setActiveTab("all-projects")}
                >
                  All Projects
                </Button>
              </div>

              {activeTab == "members" && <MembersTable />}
              {activeTab == "projects" && <ProjectsTable view={"teams"} />}
              {activeTab == "all-projects" && <ProjectsTable view={"all"} />}
            </>
          ) : (
            <div className="flex flex-col text-center h-[80%] justify-center bg-white">
              <p className="text-xl text-muted-foreground mb-2">
                Join or create a team to continue
              </p>
              <p className="text-sm text-muted-foreground">
                Use the sidebar to create a new team or join an existing one with a team code.
              </p>
            </div>
          )}
        </div>
      </div>
      <TeamDetailSheet />
      <ProjectDetailSheet />
    </div>
  );
};

export default Teams;
