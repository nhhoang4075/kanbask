"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "../../ui/checkbox";
import DeleteAlert from "../teams-ui/delete-alert";
import EditMember from "./edit-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const getColumns = (editable) => {
  let columns = [];

  if (editable) {
    columns = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            className="mx-1 border-blue-500 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="border-blue-400 data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700"
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
      }
    ];
  }

  columns = [
    ...columns,
    {
      accessorKey: "full_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Name
            <ArrowUpDown className="ml-0.5 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex h-fit flex-row justify-center items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage className="object-cover" src={user.avatar_url} alt="Avatar" />
              <AvatarFallback>
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <p>{user.full_name}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Status
            <ArrowUpDown className="ml-0.5 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Email
            <ArrowUpDown className="ml-0.5 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-0.5 h-4 w-4" />
          </Button>
        );
      }
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                Copy user ID
              </DropdownMenuItem>
              {editable && <EditMember user={row} />}
              <DropdownMenuSeparator />
              {editable && <DeleteAlert manage={"member"} row={[user]} />}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  return columns;
};
