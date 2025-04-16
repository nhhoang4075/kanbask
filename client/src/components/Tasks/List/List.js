"use client";

import { useState } from "react";
import { Calendar, Clock, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import { columnDefinitions, initialData } from "@/data/tasks";

export function ListView() {
  const [tasks, setTasks] = useState(initialData);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              // If moving to Done, set completedAt
              ...(newStatus === "Done" && !task.completedAt
                ? { completedAt: new Date().toISOString() }
                : {}),
              // If moving from Done to another status, clear completedAt
              ...(task.status === "Done" && newStatus !== "Done" ? { completedAt: null } : {})
            }
          : task
      )
    );
  };

  const priorityColors = {
    low: "bg-green-100 text-green-800 hover:bg-green-100/80",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
    high: "bg-red-100 text-red-800 hover:bg-red-100/80"
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{tasks.length} tasks</div>
        <Button onClick={() => setIsNewTaskDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const dueDate = formatDate(task.dueDate);
              const isOverdue =
                task.dueDate && new Date(task.dueDate) < new Date() && !task.completedAt;

              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-normal", priorityColors[task.priority])}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={task.assignedTo.avatar || "/placeholder.svg"}
                            alt={task.assignedTo.name}
                          />
                          <AvatarFallback className="text-xs">
                            {task.assignedTo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {dueDate ? (
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          isOverdue ? "text-red-500" : "text-muted-foreground"
                        )}
                      >
                        {isOverdue ? (
                          <Clock className="h-3 w-3" />
                        ) : (
                          <Calendar className="h-3 w-3" />
                        )}
                        {dueDate}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No date</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {columnDefinitions.map((column) => (
                          <SelectItem key={column.id} value={column.title}>
                            {column.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
