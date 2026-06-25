"use client";

import { useEffect, useState } from "react";

import { ProjectDataTable } from "./project-table";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";

export default function ProjectTab({ view }) {
  const { teams, selectedTeam } = useTeam();
  const { projects, selectedProject } = useProject();

  const showData = "team";

  const [teamShow, setTeamShow] = useState(selectedTeam);
  const [filterProjects, setFilterProjects] = useState(() => {
    // if (view === "all") return projectsData;
    console.log("teams", teams);
    console.log("projects", projects);
    console.log("selectedTeam", selectedTeam);
    return projects[selectedTeam.id];
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
      // if (view === "all") return projects;
      console.log("filterProjects", projects[selectedTeam.id]);
      return projects[selectedTeam.id];
    });
  }, [teamShow, view, showData, projects]);

  return (
    <div className="w-full px-6 py-4 overflow-y-auto space-y-4">
      {/* Display Project Properties */}
      {view == "all" && (
        <p className="p-2 text-gray-500 bg-white rounded-lg shadow-sm">Select a project to view</p>
      )}
      {/* Display Project Table */}

      <div>
        <ProjectDataTable data={filterProjects} manage={"project"} view={view} />
      </div>
    </div>
  );
}
