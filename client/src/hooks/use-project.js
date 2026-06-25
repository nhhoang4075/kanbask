"use client";

import { useCallback, useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      const data = await getProjectsInTeamOfUser(selectedTeam.id);
      setProjects((prev) => {
        const newProjects = { ...prev, [selectedTeam.id]: data.projects };
        return newProjects;
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTeam]);

  const fetchProjectMembers = useCallback(async (projectId) => {
    try {
      setLoading(true);
      const members = await getMembersOfProject(projectId);
      setProjectMembers(members);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Project actions
  const handleCreateProject = useCallback(
    async (projectData) => {
      try {
        setLoading(true);
        const newProject = await createProject(projectData);
        await fetchProjects();
        setSelectedProject(newProject);
        return newProject;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects]
  );

  const handleUpdateProject = useCallback(
    async (projectId, updates) => {
      try {
        setLoading(true);
        await updateProject(projectId, updates);
        await fetchProjects();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects]
  );

  const handleDeleteProject = useCallback(
    async (projectId) => {
      try {
        setLoading(true);
        await deleteProject(projectId);
        await fetchProjects();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects]
  );

  const handleAddProjectMembers = useCallback(
    async (projectId, memberIds) => {
      try {
        setLoading(true);
        await addMembersToProject(projectId, memberIds);
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
    async (projectId, memberIds) => {
      try {
        setLoading(true);
        await removeMembersFromProject(projectId, memberIds);
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

  const handleUpdateProjectMemberRole = useCallback(
    async (projectId, memberId, role) => {
      try {
        setLoading(true);
        await updateProjectRoleOfMember(projectId, memberId, role);
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
    handleUpdateProjectMemberRole,
    fetchProjects,
    fetchProjectMembers
  };

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>;
}
