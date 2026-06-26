"use client";

import React, { useEffect } from "react";
import { getGroupedTasks } from "@/data/tasks";
import KanbanColumn from "./kanban-column";
import { useTask } from "@/hooks/use-tasks";

const KanbanBoard = ({ filteredTasks }) => {
  const { moveTask } = useTask();
  let columns = getGroupedTasks(filteredTasks);

  useEffect(() => {
    columns = getGroupedTasks(filteredTasks);
  }, [filteredTasks]);

  const handleTaskMove = (taskId, destinationColumnId) => {
    // Find the corresponding status for the destination column
    const destinationColumn = columns.find((col) => col.id === destinationColumnId);
    if (!destinationColumn) return;

    moveTask(taskId, destinationColumn.title);
  };

  return (
    <div className="flex flex-col gap-4 pt-2 pb-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4" tabIndex="-1">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} handleTaskMove={handleTaskMove} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
