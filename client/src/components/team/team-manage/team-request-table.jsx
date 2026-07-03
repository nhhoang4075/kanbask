"use client";

import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";
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
import { Input } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTeam } from "@/hooks/use-team";
import { getColumns } from "@/components/team/team-manage/team-request-column";

export default function TeamRequestTable() {
  const { selectedTeam, teamJoinRequests, handleApproveJoinRequest, handleRejectJoinRequest } =
    useTeam();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columns, setColumns] = useState(
    getColumns(
      handleApproveJoinRequest,
      handleRejectJoinRequest,
      ["owner", "admin"].includes(selectedTeam.role)
    )
  );

  const table = useReactTable({
    data: teamJoinRequests,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5
      }
    }
  });

  useEffect(() => {
    table.resetRowSelection();
  }, [selectedTeam, table.getRowModel().rows]);

  return (
    <div className="flex flex-col gap-2 py-4 bg-ghost-white border-1 rounded-md">
      <div className="flex flex-row justify-between items-center flex-wrap gap-4 px-4">
        <div className="flex gap-4">
          <div className="relative rounded-md bg-white">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              value={table.getColumn("requester_full_name")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("requester_full_name")?.setFilterValue(event.target.value)
              }
              placeholder="Filter name"
              className="pl-8 w-60 focus-visible:ring-0"
            />
          </div>
          <Select
            value={table.getColumn("status")?.getFilterValue()}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="bg-white min-w-[800px] border-b overflow-x-auto">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-ghost-white hover:bg-ghost-white">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center max-w-50 truncate">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
          <Label className="text-sm text-muted-foreground" htmlFor="team-request-table-size">
            Rows per page:
          </Label>
          <Select
            id="team-request-table-size"
            value={table.getState().pagination.pageSize}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a page size" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
