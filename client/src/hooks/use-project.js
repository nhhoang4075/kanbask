"use client";

import { useCallback, useState, useEffect, createContext, useContext } from "react";

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

const ProjectContext = createContext();

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
  const { selectedTeam } = useTeam();
  const [projects, setProjects] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (teamId) => {
    if (!teamId) return;

    try {
      setLoading(true);
      const data = await getProjectsInTeamOfUser(teamId);
      setProjects((prev) => ({ ...prev, [teamId]: data.projects }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectMembers = useCallback(async (projectId) => {
    try {
      setLoading(true);
      const data = await getMembersOfProject(projectId);
      setProjectMembers(data.members);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchProjects(selectedTeam.id);
    }
  }, [selectedTeam, fetchProjects]);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectMembers(selectedProject.id);
    }
  }, [selectedProject, fetchProjectMembers]);

  // Project actions
  const handleCreateProject = useCallback(
    async (projectData) => {
      try {
        setLoading(true);
        const newProject = await createProject(projectData);
        await fetchProjects(selectedTeam.id);
        setSelectedProject(newProject);
        return newProject;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects, selectedTeam]
  );

  const handleUpdateProject = useCallback(
    async (projectId, updates) => {
      try {
        setLoading(true);
        await updateProject(projectId, updates);
        await fetchProjects(selectedTeam.id);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects, selectedTeam]
  );

  const handleDeleteProject = useCallback(
    async (projectId) => {
      try {
        setLoading(true);
        await deleteProject(projectId);
        await fetchProjects(selectedTeam.id);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects, selectedTeam]
  );

  const handleAddProjectMembers = useCallback(
    async (projectId, data) => {
      try {
        setLoading(true);
        await addMembersToProject(projectId, data);
        await fetchProjectMembers(projectId);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjectMembers]
  );

  const handleRemoveProjectMembers = useCallback(
    async (projectId, data) => {
      try {
        setLoading(true);
        await removeMembersFromProject(projectId, data);
        await fetchProjectMembers(projectId);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjectMembers]
  );

  const handleUpdateProjectRoleOfMember = useCallback(
    async (projectId, data) => {
      try {
        setLoading(true);
        await updateProjectRoleOfMember(projectId, data);
        await fetchProjectMembers(projectId);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
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
