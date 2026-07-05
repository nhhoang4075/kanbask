"use client";

import { useCallback, useState, useEffect, createContext, useContext } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createProject,
  updateProject,
  deleteProject,
  addMembersToProject,
  removeMembersFromProject,
  updateProjectRoleOfMember,
  getMembersOfProject,
  getProjectsInTeamOfUser
} from "@/actions/project-actions";
import { useTeam } from "@/hooks/use-team";
import { useSocket } from "@/hooks/use-socket";

const ProjectContext = createContext();

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
  const { selectedTeam } = useTeam();
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();

  const [error, setError] = useState(null);
  const [requestedTeamIds, setRequestedTeamIds] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchProjects = useCallback(
    (teamId) => {
      if (!teamId) return;
      setRequestedTeamIds((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]));
      return queryClient.invalidateQueries({ queryKey: ["projects", teamId] });
    },
    [queryClient]
  );

  useEffect(() => {
    if (selectedTeam) {
      fetchProjects(selectedTeam.id);
    }
  }, [selectedTeam, fetchProjects]);

  const projectQueries = useQueries({
    queries: requestedTeamIds.map((teamId) => ({
      queryKey: ["projects", teamId],
      queryFn: async () => {
        const data = await getProjectsInTeamOfUser(teamId);
        return data.projects;
      },
      enabled: !!teamId
    }))
  });

  // Keep the same lazily-populated { [teamId]: Project[] } shape existing
  // components rely on (some index by team id, some flatten with Object.values).
  const projects = requestedTeamIds.reduce((acc, teamId, idx) => {
    acc[teamId] = projectQueries[idx]?.data ?? [];
    return acc;
  }, {});

  const selectedProject =
    (projects[selectedTeam?.id] || []).find((p) => p.id === selectedProjectId) ?? null;

  const setSelectedProject = useCallback((project) => {
    setSelectedProjectId(project?.id ?? null);
  }, []);

  const projectMembersQuery = useQuery({
    queryKey: ["project-members", selectedProject?.id],
    queryFn: async () => {
      const data = await getMembersOfProject(selectedProject.id);
      return data.members;
    },
    enabled: !!selectedProject?.id
  });
  const projectMembers = projectMembersQuery.data ?? [];

  const fetchProjectMembers = useCallback(
    (projectId) => {
      if (!projectId) return;
      return queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
    },
    [queryClient]
  );

  const loading = projectQueries.some((q) => q.isLoading) || projectMembersQuery.isLoading;

  // Real-time sync: another member's project create/update/delete/membership change
  useEffect(() => {
    if (!socket || !connected) return;

    const handleProjectChanged = (payload) => {
      if (payload?.team_id) {
        queryClient.invalidateQueries({ queryKey: ["projects", payload.team_id] });
      }
      if (payload?.project_id) {
        queryClient.invalidateQueries({ queryKey: ["project-members", payload.project_id] });
      }
    };

    socket.on("project_changed", handleProjectChanged);

    return () => {
      socket.off("project_changed", handleProjectChanged);
    };
  }, [socket, connected, queryClient]);

  const handleConflict = useCallback(
    async (err, invalidateKeys) => {
      if (err?.status === 409) {
        toast.error(err.message || "This was updated by someone else. Refreshing...");
        await Promise.all(
          invalidateKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
        );
        return true;
      }
      return false;
    },
    [queryClient]
  );

  // Project actions
  const handleCreateProject = useCallback(
    async (projectData) => {
      try {
        const newProject = await createProject(projectData);
        await fetchProjects(selectedTeam.id);
        setSelectedProject(newProject);
        return newProject;
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchProjects, selectedTeam, setSelectedProject]
  );

  const handleUpdateProject = useCallback(
    async (projectId, updates) => {
      try {
        const currentProject = (projects[selectedTeam?.id] || []).find((p) => p.id === projectId);
        await updateProject(projectId, { ...updates, updated_at: currentProject?.updated_at });
        await fetchProjects(selectedTeam.id);
      } catch (err) {
        const isConflict = await handleConflict(err, [["projects", selectedTeam?.id]]);
        if (!isConflict) {
          setError(err);
          throw err;
        }
      }
    },
    [fetchProjects, selectedTeam, projects, handleConflict]
  );

  const handleDeleteProject = useCallback(
    async (projectId) => {
      try {
        await deleteProject(projectId);
        await fetchProjects(selectedTeam.id);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchProjects, selectedTeam]
  );

  const handleAddProjectMembers = useCallback(
    async (projectId, data) => {
      try {
        await addMembersToProject(projectId, data);
        await fetchProjectMembers(projectId);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchProjectMembers]
  );

  const handleRemoveProjectMembers = useCallback(
    async (projectId, data) => {
      try {
        await removeMembersFromProject(projectId, data);
        await fetchProjectMembers(projectId);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchProjectMembers]
  );

  const handleUpdateProjectRoleOfMember = useCallback(
    async (projectId, data) => {
      try {
        await updateProjectRoleOfMember(projectId, data);
        await fetchProjectMembers(projectId);
      } catch (err) {
        setError(err);
        throw err;
      }
    },
    [fetchProjectMembers]
  );

  const contextValue = {
    projects,
    selectedProject,
    projectMembers,
    loading,
    error,

    setSelectedProject,

    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleAddProjectMembers,
    handleRemoveProjectMembers,
    handleUpdateProjectRoleOfMember,
    fetchProjects,
    fetchProjectMembers
  };

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
}
