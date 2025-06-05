"use client";

import TaskActions from "@/components/task/task-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Badge } from "@/components/ui/badge";
import { pickPriorityColor } from "@/lib/task-utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
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
            <AvatarGroup className="flex items-center justify-center -space-x-2.5">
              {task.assignees.slice(0, 3).map((assignee) => (
                <Avatar key={assignee.user_id} className="h-8 w-8 text-xs">
                  <AvatarImage className="object-cover" src={assignee.avatar_url} />
                  <AvatarFallback style={pickAvatarColor(assignee.full_name)}>
                    {getInitials(assignee.full_name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-medium bg-blue-100 text-prussian-blue">
                    +{task.assignees.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </AvatarGroup>
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
