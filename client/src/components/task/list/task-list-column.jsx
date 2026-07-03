"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpDown, Clock, GripVertical, PanelRight } from "lucide-react";

import TaskActions from "@/components/task/task-actions";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { pickPriorityColor, pickStatusColor, comparePriority } from "@/lib/task-utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { cn, formatDateShort, capitalCase } from "@/lib/utils";

export const getColumns = () => {
  return [
    {
      id: "drag",
      enableSorting: false,
      size: 50,
      header: () => null,
      cell: ({ table }) => {
        const isDragDisabled =
          table.getState().sorting.length > 0 || table.getState().columnFilters.length > 0;

        return isDragDisabled ? (
          <div className="w-4 h-4" />
        ) : (
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
        );
      }
    },
    {
      id: "select",
      enableSorting: false,
      header: ({ table }) => (
        <div className="flex flex-row justify-start items-center w-8">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => {
        function RowNumberWithCheckbox() {
          const [isHovered, setIsHovered] = useState(false);

          return (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => {
                e.stopPropagation();
                row.toggleSelected(!row.getIsSelected());
              }}
              className="flex flex-row justify-start items-center"
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
        }

        return <RowNumberWithCheckbox />;
      }
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div className="flex flex-row items-center justify-center gap-1">
          <span>Task</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const task = row.original;

        const router = useRouter();
        const searchParams = useSearchParams();
        const isOpen = searchParams.get("task") === String(task.id);

        const handleOpenDetails = () => {
          if (!isOpen) {
            const params = new URLSearchParams(searchParams);
            params.set("task", String(task.id));
            router.push(`?${params.toString()}`);
          }
        };

        return (
          <div className="group grid grid-cols-[minmax(0,1fr)_auto] gap-1 items-center">
            <div>
              <p className="font-medium text-primary truncate">{task.title}</p>
              <p className="text-sm text-muted-foreground truncate">{task.description}</p>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out"
                    onClick={handleOpenDetails}
                  >
                    <PanelRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open details panel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="flex flex-row items-center justify-center gap-1">
          <span>Status</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const task = row.original;

        return task.status ? (
          <div className="text-center">
            <Badge className={cn("text-xs font-normal rounded-sm", pickStatusColor(task.status))}>
              {capitalCase(task.status)}
            </Badge>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">-</div>
        );
      }
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <div className="flex flex-row items-center justify-center gap-1">
          <span>Priority</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const task = row.original;

        return task.priority ? (
          <div className="text-center">
            <Badge
              className={cn("text-xs font-normal rounded-sm", pickPriorityColor(task.priority))}
            >
              {capitalCase(task.priority)}
            </Badge>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">-</div>
        );
      },
      sortingFn: (rowA, rowB) => {
        return comparePriority(rowA.original.priority, rowB.original.priority);
      }
    },
    {
      accessorKey: "assignees",
      header: "Assignees",
      cell: ({ row }) => {
        const task = row.original;

        return task.assignees.length > 0 ? (
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
          <div className="text-center text-sm text-muted-foreground">-</div>
        );
      }
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <div className="flex flex-row items-center justify-center gap-1">
          <span>Due</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const task = row.original;
        const dueDate = task.due_date;
        const isOverdue = dueDate && new Date(dueDate) < new Date() && !task.completed_at;

        return dueDate ? (
          <div
            className={cn(
              "flex items-center justify-center gap-1 text-sm",
              isOverdue && "text-red-500"
            )}
          >
            {isOverdue && <Clock className="h-3 w-3" />}
            <span>{formatDateShort(dueDate)}</span>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">-</div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.due_date);
        const dateB = new Date(rowB.original.due_date);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateA - dateB;
      }
    },
    {
      accessorKey: "completed_at",
      header: ({ column }) => (
        <div className="flex flex-row items-center justify-center gap-1">
          <span>Completed</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const task = row.original;

        return task.completed_at ? (
          <div className={cn("flex items-center justify-center gap-1 text-sm")}>
            <span>{formatDateShort(task.completed_at)}</span>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">-</div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.completed_at);
        const dateB = new Date(rowB.original.completed_at);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        return dateA - dateB;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original;

        return <TaskActions task={task} />;
      }
    }
  ];
};
