"use client";

import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { formatDate, capitalCase } from "@/lib/utils";

export function getColumns(handleApproveJoinRequest, handleRejectJoinRequest, editable) {
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
      accessorKey: "requester_full_name",
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
        const request = row.original;

        return (
          <div className="flex flex-row items-center gap-2 mx-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                className="object-cover"
                src={request.requester_avatar_url}
                alt="Avatar"
              />
              <AvatarFallback style={pickAvatarColor(request.requester_full_name)}>
                {getInitials(request.requester_full_name)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold truncate">{request.requester_full_name}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "requester_email",
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
        const request = row.original;

        return (
          <div className="text-left mx-4 truncate">
            <Link
              href={`mailto:${request.requester_email}`}
              target="_blank"
              className="hover:underline hover:text-blue-500 transition-all duration-200 ease-in-out"
            >
              {request.requester_email}
            </Link>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div className="space-x-1">
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
        );
      },
      cell: ({ row }) => {
        const request = row.original;

        return (
          <Badge
            className={cn(
              "rounded-sm",
              request.status === "pending"
                ? "bg-blue-100 text-blue-700"
                : request.status === "approved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            )}
          >
            {capitalCase(request.status)}
          </Badge>
        );
      }
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <div className="space-x-1">
            <span>Request Time</span>
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
        const request = row.original;
        return <p>{formatDate(request.created_at)}</p>;
      }
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex flex-row items-center justify-center gap-2 px-4">
            <Button
              variant="outline"
              size="sm"
              disabled={row.original.status !== "pending" || !editable}
              className="border-green-700 text-green-700 hover:bg-green-100 hover:text-green-500"
              onClick={() => handleApproveJoinRequest(row.original.id)}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={row.original.status !== "pending" || !editable}
              className="border-red-700 text-red-700 hover:bg-red-100 hover:text-red-500"
              onClick={() => handleRejectJoinRequest(row.original.id)}
            >
              Reject
            </Button>
          </div>
        );
      }
    }
  ];

  return columns;
}
