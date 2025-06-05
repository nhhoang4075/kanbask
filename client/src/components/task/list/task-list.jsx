"use client";

import { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Search, Plus, ArrowDownAZ } from "lucide-react";

import DragableRow from "@/components/task/list/dragable-row";
import CreateTaskSheet from "@/components/task/create-task-sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { getColumns } from "@/components/task/list/task-list-column";
import { useTask } from "@/hooks/use-task";
import { useProject } from "@/hooks/use-project";

export default function TaskList() {
  const { tasks, handleReorderTask } = useTask();
  const { selectedProject } = useProject();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [taskTableData, setTaskTableData] = useState(tasks);

  const [isCreateTaskSheetOpen, setIsCreateTaskSheetOpen] = useState(false);

  useEffect(() => {
    setTaskTableData(tasks);
  }, [tasks]);

  const columns = getColumns();

  const table = useReactTable({
    data: taskTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      rowSelection
    }
  });

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor)
  );

  // Handle DnD events
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = taskTableData.findIndex((task) => task.id === active.id);
      const newIndex = taskTableData.findIndex((task) => task.id === over.id);

      // Reorder the data
      const newTaskTableData = [...taskTableData];
      const [removed] = newTaskTableData.splice(oldIndex, 1);
      newTaskTableData.splice(newIndex, 0, removed);

      setTaskTableData(newTaskTableData);

      handleReorderTask(active.id, newIndex + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 bg-ghost-white border-1 rounded-md">
      <div className="flex flex-row justify-between items-center flex-wrap gap-4 px-4">
        <div className="flex items-center gap-4">
          <div className="relative rounded-md bg-white">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              value={table.getColumn("title")?.getFilterValue() ?? ""}
              onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
              placeholder="Filter task title"
              className="pl-8 w-60 focus-visible:ring-0"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSorting([])}
            disabled={sorting.length === 0}
            className="flex flex-row items-center gap-2"
          >
            <ArrowDownAZ className="w-4 h-4" />
            Reset
          </Button>
          <div className="text-sm text-gray-500">{taskTableData.length} tasks total</div>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button
            size="sm"
            onClick={() => setIsCreateTaskSheetOpen(true)}
            disabled={!selectedProject}
            className="flex flex-row items-center gap-2 bg-prussian-blue text-white hover:bg-prussian-blue/90"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <Table className="bg-white border-b overflow-auto">
          <TableHeader className="bg-ghost-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
            <SortableContext
              items={taskTableData.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
              disabled={sorting.length > 0}
            >
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => <DragableRow key={row.id} row={row} reorderRow={() => {}} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={columns?.length} className="h-24 text-center text-gray-500">
                    No tasks found. Let's create your first one!
                  </TableCell>
                </TableRow>
              )}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>

      <CreateTaskSheet isOpen={isCreateTaskSheetOpen} onOpenChange={setIsCreateTaskSheetOpen} />
    </div>
  );
}
