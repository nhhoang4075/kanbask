"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTaskColumns } from "./column";
import TaskDetails from "../TaskDetailsSheet/TaskDetails";
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
import DragTableRow from "./DragTableRow";

export function TasksTable({ tasks, setTasks, handleDeleteTask, handleEditTask }) {
  // Add a ref to track edit mode intent
  const editModeRef = useRef(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDelete = (e, task) => {
    if (handleDeleteTask) {
      handleDeleteTask(task.id);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(() => task);
    setShowDetails(true);
    editModeRef.current = true;
    console.log(selectedTask);
  };

  const handleViewDetails = (task) => {
    setSelectedTask(() => task);
    setShowDetails(() => true);
    console.log(selectedTask);
  };

  const handleSaveTask = (updatedTask) => {
    if (handleEditTask) {
      handleEditTask(updatedTask);
    }
  };

  const handleReorderTasks = (reorderedTasks) => {
    // Update the tasks state while preserving tasks that aren't in the filtered view
    const reorderedIds = new Set(reorderedTasks.map((task) => task.id));

    // Keep tasks that aren't in the current filtered view
    const otherTasks = tasks.filter((task) => !reorderedIds.has(task.id));

    // Combine the reordered tasks with the other tasks
    setTasks([...reorderedTasks, ...otherTasks]);
    setTableData([...reorderedTasks, ...otherTasks]);
  };

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [tableData, setTableData] = useState(tasks);

  useEffect(() => {
    setTableData(tasks);
  }, [tasks]);

  const columns = getTaskColumns(handleDelete, handleEdit, handleViewDetails);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      rowSelection
    }
  });

  //   useEffect(() => {
  //     table.resetRowSelection();
  //   }, [table.getRowModel()?.rows]);

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
      const oldIndex = tableData.findIndex((task) => task.id === active.id);
      const newIndex = tableData.findIndex((task) => task.id === over.id);

      // Reorder the data
      const newData = [...tableData];
      const [removed] = newData.splice(oldIndex, 1);
      newData.splice(newIndex, 0, removed);

      setTableData(newData);

      // Call the callback to update parent state => Call API
      if (handleReorderTasks) {
        handleReorderTasks(newData);
      }
    }
  };

  return (
    <div>
      <div className="">
        {table.getSelectedRowModel().rows.length > 0 && (
          <div className="p-2 mb-2 rounded-md flex items-center justify-between">
            <span className="text-sm font-medium">
              {table.getSelectedRowModel().rows.length} tasks selected
            </span>
            <div className="flex gap-2">
              <Button
                className="bg-blue-600 text-white hover:bg-blue-800 hover:text-white"
                size="sm"
                variant="outline"
              >
                Assign
              </Button>
              <Button size="sm" variant="outline">
                Change Status
              </Button>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <Table className="rounded-md border-2">
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.id === "actions" ? "w-[50px]" : undefined}
                  >
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
              items={tableData.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <DragTableRow
                      key={row.id}
                      row={row}
                      reorderRow={() => {}}
                      handleViewDetails={handleViewDetails}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns?.length} className="h-24 text-center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>

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
      <TaskDetails
        open={showDetails}
        task={selectedTask}
        onOpenChange={setShowDetails}
        onSave={handleSaveTask}
        initialEditMode={editModeRef.current}
      />
    </div>
  );
}
