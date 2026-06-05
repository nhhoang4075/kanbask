"use client";

import React, { useEffect, useState } from "react";
import { getGroupedTasks } from "@/data/tasks";
import KanbanColumn from "./KanbanColumn";

const KanbanBoard = ({ tasks, setTasks, handleEditTask, handleDeleteTask }) => {
  const columns = getGroupedTasks(tasks);

  const handleTaskMove = (taskId, sourceColumnId, destinationColumnId) => {
    // Find the corresponding status for the destination column
    const destinationColumn = columns.find((col) => col.id === destinationColumnId);
    if (!destinationColumn) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: destinationColumn.title,
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  const props = {
    handleTaskMove,
    handleDeleteTask,
    handleEditTask
  };

  return (
    <div className="flex flex-col gap-4 pt-2 pb-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4" tabIndex="-1">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} {...props} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
