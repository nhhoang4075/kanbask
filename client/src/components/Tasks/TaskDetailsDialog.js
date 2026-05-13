"use client";

import { Calendar, Clock, User, Users, CalendarIcon, AlignLeft } from "lucide-react";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { cn, formatDateTime } from "@/lib/utils";
import React from "react";

const TaskDetailsDialog = ({ task, open, onOpenChange }) => {
  if (!task) return null;

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };

  const dueDate = formatDateTime(task.dueDate);
  const createdAt = formatDateTime(task.createdAt);
  const updatedAt = formatDateTime(task.updatedAt);
  const completedAt = formatDateTime(task.completedAt);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completedAt;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Status and Priority */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm">
              {task.status}
            </Badge>
            <Badge variant="outline" className={cn("text-sm", priorityColors[task.priority])}>
              {task.priority} priority
            </Badge>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <AlignLeft className="mr-2 h-4 w-4" />
              Description
            </div>
            <p className="text-sm">{task.description || "No description provided."}</p>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              Assignee
            </div>
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
          </div>

          {/* Created By */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              Created By
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={task.createdBy.avatar || "/placeholder.svg"}
                  alt={task.createdBy.name}
                />
                <AvatarFallback className="text-xs">
                  {task.createdBy.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{task.createdBy.name}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Due Date
              </div>
              {dueDate ? (
                <div className={cn("text-sm", isOverdue ? "text-red-500" : "")}>
                  {isOverdue && <Clock className="inline mr-1 h-3 w-3" />}
                  {dueDate}
                  {isOverdue && " (Overdue)"}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No due date</span>
              )}
            </div>

            {/* Completed Date */}
            {task.completedAt && (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Completed
                </div>
                <span className="text-sm">{completedAt}</span>
              </div>
            )}

            {/* Created Date */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Created
              </div>
              <span className="text-sm">{createdAt}</span>
            </div>

            {/* Updated Date */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Updated
              </div>
              <span className="text-sm">{updatedAt}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
