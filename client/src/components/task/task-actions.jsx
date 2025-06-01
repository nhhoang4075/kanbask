"use client";

import { useState } from "react";
import { MoreVertical, Info, Trash } from "lucide-react";

import TaskDetailsSheet from "@/components/task/task-details-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTask } from "@/hooks/use-task";

export default function TaskActions({ task }) {
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const { handleDeleteTask } = useTask();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
          <DropdownMenuItem onSelect={() => setIsDetailsSheetOpen(true)}>
            <Info className="h-4 w-4" />
            <span>Details</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={() => handleDeleteTask(task.id)}
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TaskDetailsSheet
        isOpen={isDetailsSheetOpen}
        onOpenChange={setIsDetailsSheetOpen}
        task={task}
      />
    </div>
  );
}
