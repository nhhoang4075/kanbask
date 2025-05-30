"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { SortAsc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import KanbanTask from "./kanban-task";

const KanbanColumn = ({ column, handleTaskMove }) => {
  const [isOver, setIsOver] = useState(false);
  const [sortBy, setSortBy] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);

    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("columnId");

    if (sourceColumnId !== column.id) {
      handleTaskMove(taskId, column.id);
    }
  };

  const sortedTasks = [...column.tasks];

  if (sortBy === "priority") {
    // Sort by priority (high, medium, low)
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortBy === "name") {
    // Sort by task name alphabetically
    sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "dueDate") {
    // Sort by due date (null dates at the end)
    sortedTasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-muted/40 border-2 rounded-lg p-3 min-h-[500px]",
        isOver && "ring-2 ring-primary/20"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <SortAsc className="h-4 w-4" />
              <span className="sr-only">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("priority")}>
              Sort by Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name")}>Sort by Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
              Sort by Due Date
            </DropdownMenuItem>
            {sortBy && (
              <DropdownMenuItem onClick={() => setSortBy(null)}>Clear Sorting</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {sortedTasks.map((task) => (
          <KanbanTask key={task.id} task={task} columnId={column.id} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
