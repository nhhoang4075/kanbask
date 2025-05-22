import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Eye, MoreVertical, Trash2 } from "lucide-react";
import { useTask } from "@/hooks/use-tasks";

const MoreActions = ({ task }) => {
  const { setSelectedTask, setIsTaskDetailsOpen, deleteTask } = useTask();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 group-hover:cursor-pointer"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setSelectedTask(() => task);
            setIsTaskDetailsOpen(true);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreActions;
