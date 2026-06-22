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
import DeleteAlert from "../teams-ui/delete-alert";
import AddProject from "./add-project";
import { getProjectColumns } from "./column";
import { useTeamContext } from "@/hooks/use-teams";

export function ProjectDataTable({ data, manage, view }) {
  const {
    selectedTeam,
    selectedProject,
    setIsOpenProjectDetails,
    setSelectedProject,
    setIsOpenAddProject,
    teamsData,
    editable
  } = useTeamContext();

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columns, setColumns] = useState(
    getProjectColumns(
      setIsOpenProjectDetails,
      setSelectedProject,
      teamsData.find((team) => team.id == selectedProject?.team_id)?.name
    )
  );

  useEffect(() => {
    setColumns(
      getProjectColumns(
        setIsOpenProjectDetails,
        setSelectedProject,
        teamsData.find((team) => team.id == selectedProject?.team_id)?.name
      )
    );
  }, [selectedTeam, selectedProject, teamsData]);

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
          {editable && (
            <>
              {table.getSelectedRowModel().rows.length > 0 && (
                <DeleteAlert
                  manage={manage}
                  row={table.getSelectedRowModel().rows.map((row) => row.original)}
                />
              )}
              {view != "all" && (
                <>
                  <Button
                    className="text-white bg-blue-500 hover:bg-blue-700"
                    onClick={() => setIsOpenAddProject(true)}
                  >
                    Add Project
                  </Button>
                  <AddProject />
                </>
              )}
            </>
          )}
        </div>
      </div>
      {selectedProject ? (
        <>
          <Table className="border-1 text-center bg-white border-blue-400">
            <TableHeader className="bg-blue-200  hover:bg-blue-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-blue-200">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="text-center p-0 border-x-1 w-fit max-w-[200px] border-blue-400 overflow-hidden text-ellipsis"
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
                      if (view == "all") setSelectedProject(row.original);
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-center px-0 py-1 border-1 max-w-[200px] border-blue-400 overflow-hidden text-ellipsis"
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
        </>
      ) : (
        <p className="text-xl text-center text-muted-foreground mb-2">
          Join or create a project to continue
        </p>
      )}
    </div>
  );
}
