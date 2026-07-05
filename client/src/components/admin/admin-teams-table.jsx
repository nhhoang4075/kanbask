"use client";

import { useEffect, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/hooks/use-admin";
import { getColumns } from "@/components/admin/admin-team-column";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function AdminTeamsTable() {
  const { teams, teamsTotal, fetchTeams, error } = useAdmin();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");

  const listParams = { limit: pageSize, offset: pageIndex * pageSize, q };

  useEffect(() => {
    setPageIndex(0);
  }, [q]);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        fetchTeams({ limit: pageSize, offset: pageIndex * pageSize, q });
      },
      q ? 400 : 0
    );

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, q]);

  const columns = getColumns(listParams);

  const table = useReactTable({
    data: teams,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(teamsTotal / pageSize)),
    state: {
      pagination: { pageIndex, pageSize }
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    }
  });

  return (
    <div className="flex flex-col gap-2 py-4 bg-ghost-white border-1 rounded-md">
      <div className="flex flex-row justify-between items-center flex-wrap gap-4 px-4">
        <div className="relative rounded-md bg-white">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search teams"
            className="pl-8 w-60 focus-visible:ring-0"
          />
        </div>
      </div>
      {error && <p className="px-4 text-sm text-red-500">{error.message}</p>}
      <Table className="bg-white border-b overflow-auto">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-ghost-white hover:bg-ghost-white">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center max-w-50 truncate">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-center max-w-50 py-4 truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-6 text-center text-gray-500">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-4 px-4 pt-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground" htmlFor="admin-teams-table-size">
            Rows per page:
          </Label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(0);
            }}
          >
            <SelectTrigger id="admin-teams-table-size">
              <SelectValue placeholder="Select a page size" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageIndex((prev) => prev + 1)}
          disabled={pageIndex + 1 >= Math.max(1, Math.ceil(teamsTotal / pageSize))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
