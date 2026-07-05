"use client";

import Link from "next/link";
import { BadgeCheck, BadgeX } from "lucide-react";

import AdminUserActions from "@/components/admin/admin-user-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { cn, formatDate, capitalCase } from "@/lib/utils";

export function getColumns(listParams) {
  return [
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-row items-center gap-2 mx-4">
            <Avatar className="h-8 w-8">
              <AvatarImage className="object-cover" src={user.avatar_url} alt="Avatar" />
              <AvatarFallback style={pickAvatarColor(user.full_name)}>
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold truncate">{user.full_name}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-left mx-4 truncate">
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
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge
            className={cn(
              "rounded-sm",
              user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
            )}
          >
            {capitalCase(user.role)}
          </Badge>
        );
      }
    },
    {
      accessorKey: "is_enabled",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge
            className={cn(
              "rounded-sm",
              user.is_enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}
          >
            {user.is_enabled ? "Enabled" : "Disabled"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "email_verified",
      header: "Verified",
      cell: ({ row }) => {
        const user = row.original;
        return user.email_verified ? (
          <BadgeCheck className="h-4 w-4 text-green-600 mx-auto" />
        ) : (
          <BadgeX className="h-4 w-4 text-gray-400 mx-auto" />
        );
      }
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => <p>{formatDate(row.original.created_at)}</p>
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => <AdminUserActions user={row.original} listParams={listParams} />
    }
  ];
}
