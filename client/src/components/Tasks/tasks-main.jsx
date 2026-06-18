import { projects, teams } from "@/data/teams";
import React, { useEffect, useState } from "react";
import { TeamSelector } from "./tasks-ui/TeamSelector";
import ProjectSelector from "./tasks-ui/ProjectSelector";
import ToggleView from "./tasks-ui/ToggleView";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import NewTasks from "./tasks-ui/NewTasks";
import { Separator } from "../ui/separator";
import KanbanBoard from "./Kanban/KanbanBoard";
import { ListView } from "./List/ListView";
import TaskDetails from "./TaskDetailsSheet/TaskDetails";
import { useTask } from "@/hooks/use-tasks";

const TaskMain = () => {
  const [viewMode, setViewMode] = useState("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  const [selectedTeamId, setSelectedTeamId] = useState(teams[0].id);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const { tasks } = useTask();

  // Update filtered projects when team changes
  useEffect(() => {
    const teamProjects = projects.filter((project) => project.teamId === selectedTeamId);
    setFilteredProjects(teamProjects);

    // Select the first project of the team by default
    if (teamProjects.length > 0) {
      setSelectedProjectId(teamProjects[0].id);
    } else {
      setSelectedProjectId(null);
    }
  }, [selectedTeamId]);

  useEffect(() => {
    setFilteredTasks(() =>
      tasks.filter(
        (task) =>
          task.projectId === selectedProjectId &&
          (searchTerm
            ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              task.description.toLowerCase().includes(searchTerm.toLowerCase())
            : true)
      )
    );
  }, [selectedProjectId, tasks]);

  const handleSearchTerm = (term) => {
    setSearchTerm(() => term);
    setFilteredTasks(() =>
      tasks.filter(
        (task) =>
          task.projectId === selectedProjectId &&
          (term
            ? task.title.toLowerCase().includes(term.toLowerCase()) ||
              task.description.toLowerCase().includes(term.toLowerCase())
            : true)
      )
    );
  };

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  return (
    <main className="h-full px-4 py-1.5 overflow-hidden bg-white">
      <div className="w-full py-1.5 mb-3 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-2 flex-4">
          <h1 className="text-3xl font-bold w-auto mr-3">Project Tasks</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <TeamSelector
              teams={teams}
              selectedTeamId={selectedTeamId}
              setSelectedTeamId={setSelectedTeamId}
            />

            <ProjectSelector
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
            />
          </div>
        </div>
        <ToggleView viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      <div>
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => handleSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button
            onClick={() => setIsNewTaskDialogOpen(true)}
            className={"bg-blue-500 mb-2 w-[100px] hover:bg-blue-700 hover:cursor-pointer"}
          >
            <Plus className="h-4 w-4 " />
            Add Task
          </Button>
        </div>
        <NewTasks
          open={isNewTaskDialogOpen}
          onOpenChange={setIsNewTaskDialogOpen}
          selectedProject={selectedProject}
        />
      </div>
      <div className="flex justify-between items-center my-1.5">
        <div className="text-sm text-muted-foreground">
          {`${filteredTasks.length} ${filteredTasks.length === 1 ? "task" : "tasks"} in ${
            selectedProject.name
          }
					${searchTerm ? `filtered by "${searchTerm}"` : ""}`}
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-4 overflow-y-scroll max-h-[480px]">
        {selectedProjectId ? (
          viewMode === "kanban" ? (
            <KanbanBoard project={selectedProject} filteredTasks={filteredTasks}></KanbanBoard>
          ) : (
            <ListView project={selectedProject} filteredTasks={filteredTasks}></ListView>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground mb-4">
              {filteredProjects.length === 0
                ? `No projects found in ${selectedTeam?.name} team`
                : "Select a project to view tasks"}
            </div>
          </div>
        )}
      </div>
      <TaskDetails />
    </main>
  );
};

export default TaskMain;
