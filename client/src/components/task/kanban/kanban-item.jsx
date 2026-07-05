"use client";

import TaskActions from "@/components/task/task-actions";
import TaskAssigneeAvatars from "@/components/task/task-assignee-avatars";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pickPriorityColor } from "@/lib/task-utils";
import { cn, formatDate, capitalCase } from "@/lib/utils";

export default function KanbanItem({ task, columnId }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("columnId", columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const isOverdue = task.status !== "done" && task.due_date && new Date(task.due_date) < new Date();

  return (
    <Card
      className="p-0 cursor-grab active:cursor-grabbing shadow-xs"
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent className="px-4">
        <div className="mt-2 mb-4 space-y-1">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <h4 className="text-md font-semibold truncate">{task.title}</h4>
            <div className="-mr-2">
              <TaskActions task={task} />
            </div>
          </div>

          {task.priority && (
            <Badge
              variant="outline"
              className={cn("text-xs font-normal", pickPriorityColor(task.priority))}
            >
              {capitalCase(task.priority)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      </CardContent>
      <CardFooter className="px-4 pb-2 flex justify-between items-end">
        <div className="flex items-center gap-2">
          {task.assignees && task.assignees.length > 0 ? (
            <TaskAssigneeAvatars assignees={task.assignees} />
          ) : (
            <span className="h-6 w-6" />
          )}
        </div>

        {task.due_date && (
          <div className={cn("text-xs", isOverdue ? "text-red-500" : "text-muted-foreground")}>
            Due: {formatDate(task.due_date)}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
