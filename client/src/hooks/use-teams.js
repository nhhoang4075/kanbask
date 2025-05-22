"use client";

import { createTeam, getTeamMembers, getUserTeams } from "@/actions/teams-actions";
import { projects } from "@/data/teams";
import { createContext, useContext, useEffect, useState } from "react";
import { get } from "react-hook-form";

// Create the context
const TeamContext = createContext(undefined);

// Custom hook to use the context
export function useTeamContext() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeamContext must be used within a TeamProvider");
  }
  return context;
}

// Provider component
export function TeamProvider({ initialTeamsData = [], children }) {
  const { loading: sessionLoading } = useSession();
  const [loading, setLoading] = useState(false);

  // State management
  const [activeTab, setActiveTab] = useState("members");
  const [showData, setShowData] = useState("team");
  const [selectedTeam, setSelectedTeam] = useState(initialTeamsData[0]);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [teamsData, setTeamsData] = useState(initialTeamsData);
  const [projectsData, setProjectsData] = useState(projects);

  const [isOpenTeamDetails, setIsOpenTeamDetails] = useState(false);
  const [isOpenProjectDetails, setIsOpenProjectDetails] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    getTeamMembers(selectedTeam.id)
      .then((data) => setMembers(data.members))
      .catch((err) => console.log("Failed to load members: ", err));
  }, [selectedTeam]);

  const handleCreateTeam = async (newTeamData) => {
    createTeam(newTeamData).then((data) => {
      setSelectedTeam(() => data.team);
    });
    setActiveTab("members");
    // getUserTeams().then((data) => console.log(data));
  };

  const createProject = (teamId) => {
    // Generate a unique ID for the new project
    const projectId = `project${projectsData.length + 1}`;

    // Create the new project object
    const newProject = {
      id: projectId,
      name: "New Project",
      teamId: teamId,
      createdBy: "Current User", // In a real app, this would be the current user
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      description: "",
      tasks: []
    };

    // Update projects data
    const updatedProjectsData = [newProject, ...projectsData];

    // Update state
    setProjectsData(() => updatedProjectsData);

    // Select the new project
    setSelectedProject(() => newProject);
  };

  const updateTeamData = (teamId, updatedTeam) => {
    setTeamsData((prev) => {
      let newTeamsData = prev.map((team) => {
        if (team.id === teamId) {
          return updatedTeam;
        } else return team;
      });
      return newTeamsData;
    });
    setSelectedTeam(() => updatedTeam);
  };

  // Function to update project data
  const updateProjectData = (projectId, updatedProject) => {
    setProjectsData((prev) => {
      const projectIndex = prev.findIndex((project) => (project.id = projectId));
      let newProjectsData = prev
        .slice(0, projectIndex)
        .concat(updatedProject)
        .concat(prev.slice(teamIndex + 1));
      return newProjectsData;
    });
    setSelectedProject(() => updatedProject);
  };

  // Value object to be provided to consumers
  const value = {
    activeTab,
    setActiveTab,
    //
    handleCreateTeam,
    // createProject,
    //
    selectedTeam,
    setSelectedTeam,
    selectedProject,
    setSelectedProject,
    teamsData,
    setTeamsData,
    projectsData,
    updateTeamData,
    updateProjectData,
    //
    showData,
    setShowData,
    //
    isOpenTeamDetails,
    setIsOpenTeamDetails,
    isOpenProjectDetails,
    setIsOpenProjectDetails,
    members
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
