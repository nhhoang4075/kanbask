"use client";

import KanbanBoard from "@/components/Tasks/Kanban/KanbanBoard";
import { ListView } from "@/components/Tasks/List/List";
import NewTasks from "@/components/Tasks/NewTasks";
import ProjectSelector from "@/components/Tasks/ProjectSelector";
import ToggleView from "@/components/Tasks/ToggleView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialData, projects } from "@/data/tasks";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const page = () => {
  // 2 view modes: kanban and list
  const [viewMode, setViewMode] = useState("kanban");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [tasks, setTasks] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(projects[0]);

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
      assignedTo: null,
      dueDate: taskData.dueDate,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setIsNewTaskDialogOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (task) => {
    // In a real implementation, you would:
    // setEditingTask(task)
    // setIsEditTaskDialogOpen(true)
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.projectId === selectedProject.id &&
      (searchTerm
        ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  return (
    <main className="w-full mx-auto px-4 py-1.5 overflow-hidden">
      <div className="w-full py-1.5 mb-3 flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-2 flex-1">
          <h1 className="text-3xl font-bold w-auto mr-3">Project Tasks</h1>
          <ProjectSelector
            projects={projects}
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
          />
        </div>
        <ToggleView viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      <div>
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      <div
        clastasks={filteredTasks}
        setTasks={setTasks}
        searchTerm={searchTerm}
        projectId={selectedProject.id}
        sName="flex justify-between items-center mb-1.5"
      >
        <div className="text-sm text-muted-foreground">
          {`${filteredTasks.length} ${filteredTasks.length === 1 ? "task" : "tasks"} in ${
            selectedProject.name
          }
					${searchTerm ? `filtered by "${searchTerm}"` : ""}`}
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-y-scroll max-h-[500px]">
        {viewMode === "kanban" ? (
          <KanbanBoard
            project={selectedProject}
            tasks={filteredTasks}
            setTasks={setTasks}
            handleDeleteTask={handleDeleteTask}
            handleEditTask={handleEditTask}
          />
        ) : (
          <ListView
            project={selectedProject}
            tasks={filteredTasks}
            setTasks={setTasks}
            handleDeleteTask={handleDeleteTask}
            handleEditTask={handleEditTask}
          />
        )}
      </div>
    </main>
  );
};

export default page;
