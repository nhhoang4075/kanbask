"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import MoreButton from "../teams-ui/more-button";
import { formatDate } from "@/lib/teams-utils";

export const getProjectColumns = (teamName) => [
  {
    cell: ({ row }) => (
      <Checkbox
        className="mx-1.5 border-blue-400 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
        id={row.id}
        name={row.id}
      />
    ),
    id: "select",
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: "teams",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: () => {
      return <p>{teamName}</p>;
    }
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{formatDate(row.original.created_at)}</p>;
    }
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{formatDate(row.original.created_at)}</p>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        // <MoreButton
        //   object={project}
        //   setOpenDetails={setIsOpenProjectDetails}
        //   setSelected={setSelectedProject}
        //   manage={"project-member"}
        // />
        <div>
          <Button variant="ghost">{/* <Pencil className="h-4 w-4" /> */}</Button>
        </div>
      );
    }
  }
];
