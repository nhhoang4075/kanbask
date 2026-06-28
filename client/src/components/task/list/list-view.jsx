"use client";

import TaskList from "./task-list";

export function ListView({ tasks, setTasks, handleEditTask, handleDeleteTask }) {
  const props = { tasks, setTasks, handleDeleteTask, handleEditTask };

  return (
    <div className="flex flex-col gap-4 py-2.5">
      <TaskList {...props} />
    </div>
  );
}
