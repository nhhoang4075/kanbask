"use client";

import KanbanBoard from "@/components/Tasks/Kanban/KanbanBoard";
import { ListView } from "@/components/Tasks/List/ListView";
import NewTasks from "@/components/Tasks/NewTasks";
import ProjectSelector from "@/components/Tasks/ProjectSelector";
import { TeamSelector } from "@/components/Tasks/TeamSelector";
import ToggleView from "@/components/Tasks/ToggleView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getProjectsByTeam, initialData } from "@/data/tasks";
import { projectsData, teams } from "@/data/teams";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [viewMode, setViewMode] = useState("kanban");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [tasks, setTasks] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);

  const [selectedTeamId, setSelectedTeamId] = useState(teams[0].id);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Update filtered projects when team changes
  useEffect(() => {
    const teamProjects = projectsData.filter((project) => project.teamId === selectedTeamId);
    setFilteredProjects(() => teamProjects);

    // Select the first project of the team by default
    if (teamProjects.length > 0) {
      setSelectedProjectId(() => teamProjects[0].id);
    } else {
      setSelectedProjectId(() => null);
    }
  }, [selectedTeamId]);
  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

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
  }, [selectedProjectId]);

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

  // Handle team change
  const handleTeamChange = (teamId) => {
    setSelectedTeamId(() => teamId);
  };

  // Handle project change
  const handleProjectChange = (projectId) => {
    setSelectedProjectId(() => projectsData.filter((project) => project.id == projectId)[0].id);
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      projectId: selectedProject.id,
      title: taskData.title,
      description: taskData.description,
      status: "To Do",
      priority: taskData.priority,
      createdBy: {
        id: "user-1",
        name: "John Doe",
        avatar: ""
      },
      assignedTo: taskData.assignedTo || [],
      dueDate: taskData.dueDate,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsNewTaskDialogOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,
              ...updatedTask,
              updatedAt: new Date().toISOString(),
              // If moving to Done, set completedAt
              ...(updatedTask.status === "Done" && !task.completedAt
                ? { completedAt: new Date().toISOString() }
                : {}),
              // If moving from Done to another status, clear completedAt
              ...(task.status === "Done" && updatedTask.status !== "Done"
                ? { completedAt: null }
                : {})
            }
          : task
      )
    );
  };

  return (
    <main className="w-full mx-auto px-4 py-1.5 overflow-hidden">
      <div className="w-full py-1.5 mb-3 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-2 flex-4">
          <h1 className="text-3xl font-bold w-auto mr-3">Project Tasks</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <TeamSelector
              teams={teams}
              selectedTeamId={selectedTeamId}
              onTeamChange={handleTeamChange}
            />

            <ProjectSelector
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              onProjectChange={handleProjectChange}
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
          handleAddTask={handleAddTask}
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
            <KanbanBoard
              project={selectedProject}
              tasks={filteredTasks}
              setTasks={setFilteredTasks}
              handleDeleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
            ></KanbanBoard>
          ) : (
            <ListView
              project={selectedProject}
              tasks={filteredTasks}
              setTasks={setFilteredTasks}
              handleDeleteTask={handleDeleteTask}
              handleEditTask={handleEditTask}
            ></ListView>
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
    </main>
  );
};

export default page;
