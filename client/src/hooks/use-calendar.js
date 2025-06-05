// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { getTeams } from "@/actions/team-actions";
// import { getProjectsInTeam } from "@/actions/project-actions";
// import { getProjectTasks } from "@/actions/task-action";

// const CalendarContext = createContext();
// export function useCalendar() {
//   return useContext(CalendarContext);
// }
// export function CalendarProvider({ children }) {
//   const [teams, setTeams] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       try {
//         const teamsData = await getTeams();
//         setTeams(teamsData);

//         if (teamsData.teams.length > 0) {
//           // Get projects for all teams in teamsData
//           const projectsData = await Promise.all(
//             teamsData.teams.map(team => getProjectsInTeam(team.id).then(projects => projects.projects))
//           ).then(results => results.flat()); // Flatten the array of arrays
//           setProjects(projectsData);

//           if (projectsData.length > 0) {
//             // Get tasks for all projects in projectsData
//             const tasksData = await Promise.all(
//               projectsData.map(project => getProjectTasks(project.id).then(tasks => tasks.tasks))
//             ).then(results => results.flat()); // Flatten the array of arrays
//             setTasks(tasksData);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching calendar data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   return (
//     <CalendarContext.Provider value={{
//       teams,
//       projects,
//       tasks,
//       loading,
//     }}>
//       {children}
//     </CalendarContext.Provider>
//   );
// }
