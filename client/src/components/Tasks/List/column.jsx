"use client";

import { ArrowUpDown, Calendar, Clock, GripVertical, Paperclip } from "lucide-react";
import MoreActions from "../tasks-ui/MoreActions";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { formatDate, priorityColors } from "@/lib/tasks-utils";
import { useTask } from "@/hooks/use-tasks";

export const getTaskColumns = () => {
  return [
    {
      id: "drag",
      enableSorting: false,
      size: 40,
      header: () => null,
      cell: ({ row }) => (
        <div className="cursor-grab active:cursor-grabbing flex items-center justify-center h-full">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )
    },
    {
      id: "select",
      enableSorting: false,
      header: ({ column, table }) => (
        <div className="flex flex-row">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            // className="translate-y-[2px]"
          />
          <ArrowUpDown
            className="ml-1 h-4 w-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      ),
      cell: ({ row, table }) => {
        const RowNumberWithCheckbox = () => {
          const [isHovered, setIsHovered] = useState(false);

          return (
            <div
              className="flex items-center justify-center h-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => {
                e.stopPropagation();
                row.toggleSelected(!row.getIsSelected());
              }}
            >
              {row.getIsSelected() ? (
                <Checkbox checked={true} />
              ) : isHovered ? (
                <Checkbox checked={false} />
              ) : (
                <span className="text-sm text-muted-foreground">{row.index + 1}</span>
              )}
            </div>
          );
        };

        return <RowNumberWithCheckbox />;
      }
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 font-medium"
        >
          Task
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="w-fit max-w-[300px] overflow-hidden">
            <div className="font-medium text-primary overflow-hidden text-ellipsis">
              {task.title}
            </div>
            <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis">
              {task.description}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium justify-center w-full"
        >
          Priority
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const priority = row.getValue("priority");
        return (
          <div className="text-center">
            <Badge
              variant="outline"
              className={cn("text-xs font-normal", priorityColors[priority])}
            >
              {priority}
            </Badge>
          </div>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        const priorityA = priorityValues[rowA.getValue(columnId)];
        const priorityB = priorityValues[rowB.getValue(columnId)];
        return priorityA < priorityB ? -1 : priorityA > priorityB ? 1 : 0;
      }
    },
    {
      accessorKey: "assignedTo",
      header: "Assignees",
      cell: ({ row }) => {
        const assignees = row.getValue("assignedTo");
        return assignees && assignees.length > 0 ? (
          <AvatarGroup>
            {assignees.slice(0, 3).map((assignee) => (
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
            {assignees.length > 3 && (
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-muted">
                  +{assignees.length - 3}
                </AvatarFallback>
              </Avatar>
            )}
          </AvatarGroup>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        );
      }
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium w-full justify-center"
        >
          Due Date
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate");
        const formattedDate = formatDate(dueDate);
        const isOverdue = dueDate && new Date(dueDate) < new Date() && !row.original.completedAt;

        return formattedDate ? (
          <div
            className={cn(
              "flex items-center gap-1 text-md justify-center",
              isOverdue ? "text-red-500" : "text-muted-foreground"
            )}
          >
            {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
            {formattedDate}
          </div>
        ) : (
          <div className="text-md text-muted-foreground text-center">No date</div>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = rowA.getValue(columnId) ? new Date(rowA.getValue(columnId)) : null;
        const dateB = rowB.getValue(columnId) ? new Date(rowB.getValue(columnId)) : null;

        // Handle null values - null values come last in ascending order
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      }
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 w-full font-medium text-center justify-center"
        >
          Updated At
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt");
        const formattedDate = formatDate(updatedAt);

        return (
          <div className="flex items-center gap-1 text-md justify-center">{formattedDate}</div>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = rowA.getValue(columnId) ? new Date(rowA.getValue(columnId)) : null;
        const dateB = rowB.getValue(columnId) ? new Date(rowB.getValue(columnId)) : null;

        // Handle null values - null values come last in ascending order
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      }
    },
    {
      accessorKey: "attachments",
      header: "Files",
      cell: ({ row }) => {
        const attachments = row.getValue("attachments") || [];
        return attachments.length > 0 ? (
          <div className="flex items-center gap-1 text-sm">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span>{attachments.length}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        );
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0 font-medium w-full justify-center"
        >
          Status
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1 text-md justify-center">
            {row.original.status}
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original;
        return <MoreActions task={task} />;
      }
    }
  ];
};
