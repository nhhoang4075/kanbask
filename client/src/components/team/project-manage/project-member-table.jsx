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
import { Search, Plus, Trash } from "lucide-react";

import DeleteMemberDialog from "@/components/team/actions/delete-member-dialog";
import AddMemberDialog from "@/components/team/actions/add-member-dialog";
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
import { useProject } from "@/hooks/use-project";
import { getColumns } from "@/components/team/project-manage/project-member-column";

export default function ProjectMemberTable() {
  const { selectedProject, projectMembers } = useProject();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columns, setColumns] = useState(getColumns(selectedProject.role === "owner"));

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const table = useReactTable({
    data: projectMembers,
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
  }, [selectedProject, table.getRowModel().rows]);

  return (
    <div className="flex flex-col gap-2 py-4 bg-ghost-white border-1 rounded-md">
      <div className="flex flex-row justify-between items-center flex-wrap gap-4 px-4">
        <div className="flex gap-4">
          <div className="relative rounded-md bg-white">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              value={table.getColumn("full_name")?.getFilterValue() ?? ""}
              onChange={(event) => table.getColumn("full_name")?.setFilterValue(event.target.value)}
              placeholder="Filter name"
              className="pl-8 focus-visible:ring-0"
            />
          </div>
          <Select
            value={table.getColumn("role")?.getFilterValue()}
            onValueChange={(value) =>
              table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button
            variant="destructive"
            size="sm"
            className="flex flex-row items-center gap-2"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={table.getSelectedRowModel().rows.length === 0}
          >
            <Trash className="w-4 h-4" />
            Delete
          </Button>
          <Button
            size="sm"
            className="flex flex-row items-center gap-2 bg-prussian-blue text-white hover:bg-prussian-blue/90"
            onClick={() => setIsAddMemberDialogOpen(true)}
            disabled={!["owner", "admin"].includes(selectedProject.role)}
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
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
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        members={table.getSelectedRowModel().rows.map((row) => row.original)}
        type="project"
      />
      <AddMemberDialog isOpen={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen} />
    </div>
  );
}
