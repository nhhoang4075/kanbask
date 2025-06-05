"use client";

import { flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TableCell, TableRow } from "@/components/ui/table";

export default function DragableRow({ row }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.original.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : 0
  };

  return (
    <TableRow
      key={row.original.id}
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell, index) => (
        <TableCell
          key={cell.id}
          {...(index === 0 ? { ...attributes, ...listeners } : {})}
          className="max-w-50 truncate"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
