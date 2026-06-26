"use client";
import { Calendar, Clock, Paperclip } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";

import { AvatarGroup } from "@/components/ui/avatar-group";
import MoreActions from "../tasks-ui/more-action";
import { useTask } from "@/hooks/use-tasks";
import { formatDate, priorityColors } from "@/lib/tasks-utils";
import { cn } from "@/lib/utils";

const KanbanTask = ({ task, columnId }) => {
  const { selectedTask, deleteTask } = useTask();

  // Add a ref to track edit mode intent

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("columnId", columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDelete = (e) => {
    deleteTask(task.id);
  };

  const handleEdit = (e) => {
    setShowDetails(true);
    // We'll use a ref to track that we want to open in edit mode
    editModeRef.current = true;
  };

  const dueDate = formatDate(task.dueDate);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completedAt;
  const attachmentCount = task.attachments?.length || 0;

  return (
    <>
      <Card
        className="p-0 border-2 border-gray-400 cursor-grab active:cursor-grabbing shadow-sm transition-shadow group"
        draggable
        onDragStart={handleDragStart}
      >
        <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
          <div className="flex flex-col gap-2">
            <h4 className="text-md font-semibold text-primary">{task.title}</h4>
            <Badge
              variant="outline"
              className={cn("text-xs font-normal", priorityColors[task.priority])}
            >
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <MoreActions task={task} />
          </div>
        </CardHeader>
        <CardContent className="px-3 text-xs text-muted-foreground max-h-[175px] overflow-hidden text-ellipsis">
          {task.description}
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {task.assignedTo && task.assignedTo.length > 0 ? (
              <AvatarGroup>
                {task.assignedTo.slice(0, 3).map((assignee) => (
                  <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={assignee.avatar || ""} alt={assignee.name} />
                    <AvatarFallback className="text-xs">
                      {assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignedTo.length > 3 && (
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs bg-muted">
                      +{task.assignedTo.length - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </AvatarGroup>
            ) : (
              <span className="h-6 w-6" />
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Paperclip className="h-3 w-3" />
              {attachmentCount}
            </div>
          </div>

          {dueDate && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
              {dueDate}
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default KanbanTask;
