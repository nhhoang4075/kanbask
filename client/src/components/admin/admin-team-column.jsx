"use client";

import AdminTeamActions from "@/components/admin/admin-team-actions";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, capitalCase } from "@/lib/utils";

export function getColumns(listParams) {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <p className="font-semibold truncate mx-4">{row.original.name}</p>
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Badge variant="outline" className="rounded-sm font-mono">
          {row.original.code}
        </Badge>
      )
    },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const team = row.original;
        if (!team.owner_id) {
          return <p className="text-gray-400">—</p>;
        }
        return (
          <div className="text-left mx-4">
            <p className="truncate">{team.owner_full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{team.owner_email}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "member_count",
      header: "Members",
      cell: ({ row }) => <p>{row.original.member_count}</p>
    },
    {
      accessorKey: "join_policy",
      header: "Join Policy",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "rounded-sm",
            row.original.join_policy === "auto"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          )}
        >
          {capitalCase(row.original.join_policy)}
        </Badge>
      )
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => <p>{formatDate(row.original.created_at)}</p>
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => <AdminTeamActions team={row.original} listParams={listParams} />
    }
  ];
}
