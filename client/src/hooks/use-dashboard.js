"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getTeamsOfUser } from "@/actions/team-actions";
import { getProjectsInTeamOfUser } from "@/actions/project-actions";
import { getTasksOfProject } from "@/actions/task-actions";

const DashboardContext = createContext();

export function useDashboard() {
  return useContext(DashboardContext);
}
export function DashboardProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const projectsData = await getProjectsInTeamOfUser(selectedTeamId);
      setProjects(projectsData.projects);

      if (projectsData.projects.length > 0) {
        setSelectedProjectId(projectsData.projects[0].id);

        // Fetch tasks from all projects
        const tasksPromises = projectsData.projects.map((project) => getTasksOfProject(project.id));
        const tasksData = await Promise.all(tasksPromises);
        const allTasks = tasksData.reduce((acc, projectTasks) => {
          return acc.concat(projectTasks.tasks);
        }, []);
        setTasks(allTasks);
      } else {
        setSelectedProjectId(null);
        setTasks([]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [selectedTeamId]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await getTeamsOfUser();
      setTeams(teamsData.teams);
      setSelectedTeamId(teamsData.teams[0].id);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getProjectsInTeamOfUser(selectedTeamId);
      setProjects(projectsData.projects);
      setSelectedProjectId(projectsData.projects[0]?.id || null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await getTasksOfProject(selectedProjectId);
      setTasks(tasksData.tasks);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams data on initial render, set selectedTeamId to the first team and fetch data
  useEffect(() => {
    fetchTeams();
  }, []);

  // Fetch data when selectedTeamId changes
  useEffect(() => {
    if (selectedTeamId) {
      fetchData();
    }
  }, [selectedTeamId, fetchData]);

  // Context value
  const contextValue = {
    teams,
    projects,
    tasks,
    loading,
    error,
    selectedTeamId,
    setSelectedTeamId,
    selectedProjectId,
    setSelectedProjectId
  };
  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
}
