"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import DeleteAlert from "../teams-ui/DeleteAlert";
import AddProject from "./AddProject";
import { ProjectDetailSheet } from "./ProjectDetailSheet";
import { getProjectColumns } from "./column";

export function ProjectDataTable({
  data,
  manage,
  setSelectedProject,
  setIsOpenProjectDetails,
  view
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = getProjectColumns(setIsOpenProjectDetails, setSelectedProject);
  const table = useReactTable({
    data,
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
  }, [table.getRowModel().rows]);

  return (
    <div>
      <div className="flex flex-row pl-1 justify-between h-fit items-center">
        <div className="relative rounded-md bg-white mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            value={table.getColumn("name")?.getFilterValue() ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            placeholder="Filter name"
            className="pl-8"
          />
        </div>
        <div className="flex flex-row justify-end gap-3 my-2">
          {table.getSelectedRowModel()?.rows.length == 1 && (
            <ProjectDetailSheet project={table.getSelectedRowModel().rows[0].original} />
          )}
          {table.getSelectedRowModel().rows.length > 0 && (
            <DeleteAlert
              manage={manage}
              row={table.getSelectedRowModel().rows.map((row) => row.original)}
            />
          )}
          {view == "team" && <AddProject />}
        </div>
      </div>
      <Table className="rounded-md border-2 border-gray-400 text-center bg-white">
        <TableHeader className="bg-neutral-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="text-center border-x-1 max-w-[150px] border-neutral-400 overflow-hidden text-ellipsis"
                    key={header.id}
                  >
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
              <TableRow
                onClick={() => {
                  // row.toggleSelected();
                  if (view == "all") setSelectedProject(row.original);
                  // if (setFunction) setFunction(row.original);
                }}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-center border-x-1 max-w-[150px] border-neutral-400 overflow-hidden text-ellipsis"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
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
