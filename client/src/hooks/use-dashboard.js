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

  // Fetch all data consecutively
  const fetchAllData = useCallback(
    async (teamId) => {
      setLoading(true);
      try {
        const projectsData = await getProjectsInTeamOfUser(selectedTeamId || teamId);
        setProjects(projectsData.projects);

        if (projectsData.projects.length > 0) {
          // Fetch tasks from all projects
          const tasksPromises = projectsData.projects.map((project) =>
            getTasksOfProject(project.id)
          );
          const tasksData = await Promise.all(tasksPromises);
          const allTasks = tasksData.reduce((acc, projectTasks) => {
            return acc.concat(projectTasks.tasks);
          }, []);
          setTasks(allTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [selectedTeamId]
  );

  // Fetch teams data on initial render, set selectedTeamId to the first team and fetch all other data
  useEffect(() => {
    const fetchTeamsAndData = async () => {
      setLoading(true);
      try {
        const teamsData = await getTeamsOfUser();
        setTeams(teamsData.teams);
        fetchAllData(teamsData.teams[0].id); // Fetch data for the first team
        setSelectedTeamId(teamsData.teams[0].id); // Set the first team as the chosen team
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndData();
  }, []);
  // Fetch data when selectedTeamId changes
  useEffect(() => {
    if (selectedTeamId) {
      fetchAllData();
    }
  }, [selectedTeamId, fetchAllData]);

  // Context value
  const contextValue = {
    teams,
    projects,
    tasks,
    loading,
    error,
    selectedTeamId,
    setSelectedTeamId
  };
  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
}
