import { useMemo } from "react";
import { useTask } from "@/hooks/use-task";
import KanbanColumn from "./kanban-column";

const COLUMN_TYPES = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" }
];

export default function KanbanBoard() {
  const { tasks, handleUpdateTask } = useTask();

  // Nhóm tasks theo status mỗi khi tasks array thay đổi
  const columns = useMemo(() => {
    const groupedTasks = {
      todo: [],
      in_progress: [],
      review: [],
      done: []
    };

    tasks.forEach((task) => {
      if (groupedTasks[task.status]) {
        groupedTasks[task.status].push(task);
      }
    });

    return COLUMN_TYPES.map((column) => ({
      ...column,
      tasks: groupedTasks[column.id] || []
    }));
  }, [tasks]);

  const handleMoveTask = async (taskId, destinationColumnId) => {
    const newStatus = destinationColumnId;
    await handleUpdateTask(taskId, { status: newStatus });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" tabIndex="-1">
      {columns.map((column) => (
        <KanbanColumn key={column.id} column={column} handleMoveTask={handleMoveTask} />
      ))}
    </div>
  );
}
