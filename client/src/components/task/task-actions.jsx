"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
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
  const { handleDeleteTask } = useTask();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOpenDetails = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("task", String(task.id));
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <DropdownMenu className="dropdown-menu-selector">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="dropdown-menu-selector"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuItem onSelect={handleOpenDetails}>
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
      <TaskDetailsSheet task={task} />
    </div>
  );
}
