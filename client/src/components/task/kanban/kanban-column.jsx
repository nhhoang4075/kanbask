"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import KanbanItem from "@/components/task/kanban/kanban-item";
import CreateTaskSheet from "@/components/task/create-task-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import { pickStatusColor } from "@/lib/task-utils";
import { cn } from "@/lib/utils";

export default function KanbanColumn({ column, handleMoveTask }) {
  const [isOver, setIsOver] = useState(false);
  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] = useState(false);

  const { selectedProject } = useProject();

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

    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const sourceColumnId = e.dataTransfer.getData("columnId");

    if (sourceColumnId !== column.id) {
      handleMoveTask(taskId, column.id);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col bg-prussian-blue/5 rounded-lg py-4 h-[calc(100vh-170px)]",
          isOver && "outline outline-primary/20 outline-dashed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="px-4">
          <div
            className={cn(
              "flex items-center justify-between rounded-full mb-4 px-2 py-1.5",
              pickStatusColor(column.id)
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-black font-medium bg-white px-2.5 py-1 rounded-full">
                {column.tasks.length}
              </span>
              <h3 className="font-medium text-sm">{column.title}</h3>
            </div>
            <Button
              variant="ghost"
              className="w-6 h-6 text-white rounded-full"
              onClick={() => setIsCreateTaskSheetOpen(true)}
              disabled={!selectedProject}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="overflow-y-auto px-4">
          <div className="space-y-2 py-2">
            {column.tasks.map((task) => (
              <KanbanItem key={task.id} task={task} columnId={column.id} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <CreateTaskSheet
        isOpen={isCreateTaskSheetOpen}
        onOpenChange={setIsCreateTaskSheetOpen}
        initialValues={{ status: column.id }}
      />
    </>
  );
}
