"use client";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import DeleteProjectDialog from "@/components/team/actions/delete-project-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import TeamProjectActions from "@/components/team/actions/team-project-actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";

export const getColumns = () => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="data-[state=checked]:bg-prussian-blue data-[state=checked]:border-prussian-blue"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="data-[state=checked]:bg-prussian-blue data-[state=checked]:border-prussian-blue"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
        id={row.id}
        name={row.id}
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="space-x-1">
          <span>Project</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <p className="text-left font-semibold mx-4 truncate">{row.original.name}</p>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-prussian-blue text-white max-w-100">
              <p>{row.original.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <p className="text-left truncate">{row.original.description}</p>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-prussian-blue text-white max-w-100">
              <p>{row.original.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  },
  {
    accessorKey: "member_count",
    header: ({ column }) => {
      return (
        <div className="space-x-1">
          <span>Members</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <p>{row.original.member_count}</p>;
    }
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div className="space-x-1">
          <span>Created At</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-prussian-blue/5"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <p>{formatDate(row.original.created_at)}</p>;
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const project = row.original;

      return <TeamProjectActions project={project} />;
    }
  }
];
