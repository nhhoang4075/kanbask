"use client";

import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import DeleteAlert from "../teams-ui/delete-alert";
import EditMember from "./edit-member";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { capitalCase } from "@/lib/utils";

export function getColumns(editable) {
  let columns = [];

  if (editable) {
    columns = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            className="data-[state=checked]:bg-prussian-blue data-[state=checked]:border-prussian-blue"
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
      }
    ];
  }

  columns = [
    ...columns,
    {
      accessorKey: "full_name",
      header: ({ column }) => {
        return (
          <div className="space-x-1">
            <span>Name</span>
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
        const user = row.original;
        return (
          <div className="flex flex-row items-center gap-2 px-4">
            <Avatar className="h-8 w-8">
              <AvatarImage className="object-cover" src={user.avatar_url} alt="Avatar" />
              <AvatarFallback style={pickAvatarColor(user.full_name)}>
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium truncate">{user.full_name}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <div className="space-x-1">
            <span>Email</span>
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
        const user = row.original;

        return (
          <div className="text-left px-4 truncate">
            <Link
              href={`mailto:${user.email}`}
              target="_blank"
              className="hover:underline hover:text-blue-500 transition-all duration-200 ease-in-out"
            >
              {user.email}
            </Link>
          </div>
        );
      }
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <div className="space-x-1">
            <span>Role</span>
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
        const user = row.original;

        return (
          <Badge
            className={cn(
              "rounded-sm",
              user.role === "owner"
                ? "bg-blue-100 text-blue-700"
                : user.role === "admin"
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            )}
          >
            {capitalCase(user.role)}
          </Badge>
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
                <span className="sr-only">Team member actions</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
}
