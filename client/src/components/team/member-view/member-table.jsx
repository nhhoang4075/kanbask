"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EditMember from "./edit-member";
import DeleteAlert from "../teams-ui/delete-alert";
import { useTeam } from "@/hooks/use-team";
import { getColumns } from "./column";
import AddMember from "./add-member";
import TeamsQueue from "./team-queue";

export default function MemberTable({ manage, teamShow }) {
  const { teamMembers, projectMembers, selectedTeam, selectedProject, editable } = useTeam();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const showData = "team";

  const [members, setMembers] = useState(showData == "team" ? teamMembers : projectMembers);
  const [columns, setColumns] = useState(getColumns(members));

  const selectedId = showData == "team" ? selectedTeam?.id : selectedProject?.id;

  useEffect(() => {
    setMembers(() => (showData == "team" ? teamMembers : projectMembers));
  }, [projectMembers, teamMembers, showData]);

  useEffect(() => {
    setColumns(() => getColumns(selectedId, editable));
  }, [members, editable]);

  const table = useReactTable({
    data: members,
    columns,
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
    }
  });

  useEffect(() => {
    table.resetRowSelection();
  }, [teamShow, table.getRowModel().rows]);

  return (
    <div className="flex flex-col gap-2 py-2 bg-ghost-white border-1 rounded-md">
      <div className="flex flex-row justify-between items-center px-4">
        <div className="relative rounded-md bg-white">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            value={table.getColumn("full_name")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("full_name")?.setFilterValue(event.target.value)}
            placeholder="Filter name"
            className="pl-8 focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-row justify-end gap-2 my-2">
          {table.getSelectedRowModel()?.rows.length == 1 && (
            <EditMember user={table.getSelectedRowModel().rows[0]} />
          )}
          {table.getSelectedRowModel().rows.length > 0 && (
            <div className="w-30">
              <DeleteAlert
                manage={manage}
                row={table.getSelectedRowModel().rows.map((row) => row.original)}
              />
            </div>
          )}
          {showData == "project" ? (
            <>
              <Button
                className="text-white bg-blue-500 hover:bg-blue-700"
                onClick={() => setAddMemberOpen(true)}
              >
                Add Member
              </Button>
              <AddMember isOpen={addMemberOpen} onOpenChange={setAddMemberOpen} />
            </>
          ) : (
            <TeamsQueue />
          )}
        </div>
      </div>
      <Table className="bg-white min-w-[800px] border-b overflow-x-auto">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-ghost-white hover:bg-ghost-white">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="text-center max-w-50 truncate" key={header.id}>
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
              <TableCell colSpan={columns.length} className="h-30 text-center text-gray-500">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-4 px-4 py-2">
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
