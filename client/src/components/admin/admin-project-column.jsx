"use client";

import AdminProjectActions from "@/components/admin/admin-project-actions";
import { formatDate } from "@/lib/utils";

export function getColumns(listParams) {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <p className="font-semibold truncate mx-4">{row.original.name}</p>
    },
    {
      accessorKey: "team_name",
      header: "Team",
      cell: ({ row }) => <p className="truncate">{row.original.team_name}</p>
    },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const project = row.original;
        if (!project.owner_id) {
          return <p className="text-gray-400">—</p>;
        }
        return (
          <div className="text-left mx-4">
            <p className="truncate">{project.owner_full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{project.owner_email}</p>
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
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => <p>{formatDate(row.original.created_at)}</p>
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => <AdminProjectActions project={row.original} listParams={listParams} />
    }
  ];
}
