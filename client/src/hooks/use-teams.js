"use client";

import {
  addMembersToProject,
  createOneProject,
  deleteOneProjectById,
  getMembersOfProject,
  getProjectsOfUserInTeam,
  removeMembersFromProject,
  updateOneProjectById,
  updateProjectRoleOfMember
} from "@/actions/project-actions";
import {
  approveJoinRequest,
  createTeam,
  deleteTeam,
  getTeamMembers,
  getUserTeams,
  joinTeamByCode,
  leaveTeam,
  rejectJoinRequest,
  removeMembers,
  updateTeam,
  updateTeamMemberRole
} from "@/actions/teams-actions";
import { set } from "date-fns";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "./use-session";

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
export function TeamProvider({ children }) {
  const { user } = useSession();
  const [editable, setEditable] = useState(false);

  // State management
  const [activeTab, setActiveTab] = useState("members");
  const [showData, setShowData] = useState("team");
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [projectsData, setProjectsData] = useState({});

  const [isOpenTeamDetails, setIsOpenTeamDetails] = useState(false);
  const [isOpenProjectDetails, setIsOpenProjectDetails] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [isOpenAddProject, setIsOpenAddProject] = useState(false);

  const refreshTeamData = async (team_id) => {
    await getUserTeams()
      .then((data) => {
        setTeamsData(() => data);
        if (team_id) setSelectedTeam(() => data.find((team) => team.id == team_id));
        else setSelectedTeam(() => data[0]);
      })
      .catch((err) => console.log("Failed to load teams: ", err));
  };

  // Get data on first load
  useEffect(() => {
    try {
      const fetchTeamData = async () => {
        await getUserTeams()
          .then((data) => {
            setTeamsData(() => data);
            setSelectedTeam(() => data[0]);
          })
          .catch((err) => console.log("Failed to load teams: ", err));
      };

      fetchTeamData();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        getAllProjects().then((data) => {
          const projects = data.reduce((acc, project) => {
            acc[project.id] = project.projects;
            return acc;
          }, {});
          if (selectedTeam) {
            setProjectsData(() => projects);
            setSelectedProject(() => projects[selectedTeam.id]?.[0]);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjects();
  }, [teamsData, selectedTeam]);

  // Get team members
  useEffect(() => {
    try {
      getTeamMembers(selectedTeam.id)
        .then((data) => setTeamMembers(data.members))
        .catch((err) => console.log("Failed to load members: ", err));
    } catch (err) {
      console.log(err);
    }
  }, [selectedTeam]);

  // Get project members
  useEffect(() => {
    try {
      getMembersOfProject(selectedProject.id)
        .then((data) => {
          setProjectMembers(data.members);
        })
        .catch((err) => console.log("Failed to load members: ", err));
    } catch (err) {
      console.log(err);
    }
  }, [selectedProject]);

  useEffect(() => {
    setEditable(() => {
      if (showData == "team") {
        teamMembers?.find((member) => member.id === user.id)?.role == "owner" ? true : false;
      } else {
        projectMembers?.find((member) => member.id === user.id)?.role == "owner" ? true : false;
      }
    });
  }, [selectedTeam, selectedProject, showData]);

  const handleCreateTeam = async (newTeamData) => {
    const newTeam = await createTeam(newTeamData).then((data) => {
      setSelectedTeam(() => data.team);
    });
    setActiveTab("members");
    await getUserTeams().then((data) => setTeamsData(data));
    return newTeam;
  };

  const handleUpdateTeamData = async (teamId, updatedTeam) => {
    await updateTeam(teamId, updatedTeam);
    await refreshTeamData(teamId);
  };

  const handleDeleteTeam = async (teamId) => {
    await deleteTeam(teamId);
    await refreshTeamData();
  };

  const handleJoinTeam = async (joinCode) => {
    try {
      await joinTeamByCode(joinCode);
      await refreshTeamData();
    } catch (err) {
      console.log("Join team failed: ", err);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    await leaveTeam(teamId);
    await getUserTeams()
      .then((data) => {
        setTeamsData(() => data);
        setSelectedTeam(() => data[0]);
      })
      .catch((err) => console.log("Failed to load teams: ", err));
  };

  const handleRemoveMemberFromTeam = async (teamId, memberIds) => {
    await removeMembers(teamId, memberIds);
    await getTeamMembers(selectedTeam.id)
      .then((data) => setTeamMembers(data.members))
      .catch((err) => console.log("Failed to load members: ", err));
  };

  const handleUpdateTeamMemberRole = async (memberId, role) => {
    await updateTeamMemberRole(selectedTeam.id, memberId, role);
    await getTeamMembers(selectedTeam.id)
      .then((data) => setTeamMembers(data.members))
      .catch((err) => console.log("Failed to load members: ", err));
  };

  const handleApproveJoinRequest = async (requestId) => {
    await approveJoinRequest(requestId);
    await getTeamMembers(selectedTeam.id)
      .then((data) => setTeamMembers(data.members))
      .catch((err) => console.log("Failed to load members: ", err));
  };

  const handleDeclineJoinRequest = async () => {
    await rejectJoinRequest(requestId);
  };

  const getAllProjects = async () => {
    const projectsSet = Promise.all(
      teamsData.map(
        async (team) =>
          await getProjectsOfUserInTeam(team.id).then((data) => {
            return { id: team.id, projects: data.projects };
          })
      )
    );
    return projectsSet;
  };

  const handleAddProjectMember = async (memberIds) => {
    await addMembersToProject(selectedProject.id, memberIds);
    await getMembersOfProject(selectedProject.id).then((data) => {
      setProjectMembers(data.members);
    });
    await getProjectsOfUserInTeam(selectedProject.team_id).then((data) => {
      setProjectsData((prev) => {
        return {
          ...prev,
          [selectedProject.team_id]: data.projects
        };
      });
    });
  };

  const handleCreateProject = async (projectData) => {
    await createOneProject(projectData).then((data) => {
      setProjectsData((prev) => {
        return {
          ...prev,
          [projectData.team_id]: [...prev[projectData.team_id], data.project]
        };
      });
    });
  };

  const handleUpdateProject = async (updatedProject) => {
    await updateOneProjectById(selectedProject.id, updatedProject).then((data) =>
      console.log(data)
    );
    await getProjectsOfUserInTeam(selectedProject.team_id).then((data) => {
      setProjectsData((prev) => {
        return { ...prev, [selectedProject.team_id]: data.projects };
      });
      setSelectedProject((prev) => ({
        ...prev,
        ...updatedProject
      }));
    });
  };

  const handleRemoveMemberFromProject = async (projectId, memberIds, team_id) => {
    await removeMembersFromProject(projectId, memberIds);
    await getMembersOfProject(projectId).then((data) => {
      setProjectMembers(data.members);
    });
    await getProjectsOfUserInTeam(team_id).then((data) => {
      setProjectsData((prev) => {
        return {
          ...prev,
          [team_id]: data.projects
        };
      });
    });
  };

  const handleUpdateProjectMemberRole = async (memberId, role) => {
    await updateProjectRoleOfMember(selectedProject.id, memberId, role);
    await getMembersOfProject(selectedProject.id).then((data) => {
      setProjectMembers(data.members);
    });
  };

  const handleDeleteProject = async (projectId, team_id) => {
    await deleteOneProjectById(projectId);
    await getProjectsOfUserInTeam(team_id).then((data) => {
      setProjectsData((prev) => {
        return {
          ...prev,
          [team_id]: data.projects
        };
      });
    });
  };

  // Value object to be provided to consumers
  const value = {
    activeTab,
    setActiveTab,
    editable,
    //
    handleCreateTeam,
    selectedTeam,
    setSelectedTeam,
    teamsData,
    setTeamsData,
    teamMembers,
    handleUpdateTeamData,
    handleDeleteTeam,
    handleJoinTeam,
    handleLeaveTeam,
    handleRemoveMemberFromTeam,
    handleUpdateTeamMemberRole,
    handleApproveJoinRequest,
    handleDeclineJoinRequest,
    //
    handleCreateProject,
    selectedProject,
    setSelectedProject,
    projectsData,
    projectMembers,
    handleAddProjectMember,
    handleUpdateProject,
    handleRemoveMemberFromProject,
    handleUpdateProjectMemberRole,
    handleDeleteProject,
    //
    showData,
    setShowData,
    //
    isOpenTeamDetails,
    setIsOpenTeamDetails,
    isOpenProjectDetails,
    setIsOpenProjectDetails,
    isOpenAddProject,
    setIsOpenAddProject
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
