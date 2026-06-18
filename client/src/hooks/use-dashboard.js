import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getTeams } from "@/actions/team-actions";
import { getProjectsOfTeam } from "@/actions/project-actions";
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
  const [chosenTeamId, setChosenTeamId] = useState(null);
  
  // Fetch all data consecutively
  const fetchAllData = useCallback(async (teamId) => {
    setLoading(true);
    try {
      const projectsData = await getProjectsOfTeam(chosenTeamId || teamId);
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [chosenTeamId]);

  // Fetch teams data on initial render, set chosenTeamId to the first team and fetch all other data
  useEffect(() => {
    const fetchTeamsAndData = async () => {
      setLoading(true);
      try {
        const teamsData = await getTeams();
        setTeams(teamsData.teams);
        fetchAllData(teamsData.teams[0].id); // Fetch data for the first team
        setChosenTeamId(teamsData.teams[0].id); // Set the first team as the chosen team
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamsAndData();
  }, []);
  // Fetch data when chosenTeamId changes
  useEffect(() => {
    if (chosenTeamId) {
      fetchAllData();
    }
  }, [chosenTeamId, fetchAllData]);
  
  // Context value
  const contextValue = {
    teams,
    projects,
    tasks,
    loading,
    chosenTeamId,
    setChosenTeamId,
  };
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}
