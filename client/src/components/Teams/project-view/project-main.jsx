"use client";

import React, { useEffect, useState } from "react";
import { ProjectDataTable } from "./project-table";
import { useTeamContext } from "@/hooks/use-teams";
import InforCard from "../teams-ui/information-card";

const ProjectsTable = ({ view }) => {
  const { selectedTeam, selectedProject, showData, projectsData } = useTeamContext();

  const [teamShow, setTeamShow] = useState(selectedTeam);
  const [filterProjects, setFilterProjects] = useState(() => {
    // if (view === "all") return projectsData;
    return projectsData[selectedTeam.id];
  });

  useEffect(() => {
    setTeamShow(() => {
      if (showData == "team") {
        return selectedTeam;
      } else if (showData == "project") {
        return selectedProject;
      }
    });
  }, [selectedProject, selectedTeam, showData]);

  useEffect(() => {
    setFilterProjects(() => {
      // if (view === "all") return projectsData;
      return projectsData[selectedTeam.id];
    });
  }, [teamShow, view, showData, projectsData]);

  return (
    <div className="w-full px-3 overflow-y-auto col-span-7 space-y-4 h-[calc(100vh-7rem)]">
      {/* Display Project Properties */}
      {view == "all" && (
        <p className="p-2 text-gray-500 bg-white rounded-lg shadow-sm">Select a project to view</p>
      )}
      <InforCard teamShow={teamShow} />

      {/* Display Project Table */}

      <div>
        <ProjectDataTable data={filterProjects} manage={"project"} view={view} />
      </div>
    </div>
  );
};

export default ProjectsTable;
