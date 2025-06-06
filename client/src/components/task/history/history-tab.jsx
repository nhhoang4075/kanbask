"use client";

import { TaskLogProvider } from "@/hooks/use-task-log";
import HistoryList from "@/components/task/history/history-list";

export default function HistoryTab({ task }) {
  return (
    <TaskLogProvider>
      <HistoryList task={task} />
    </TaskLogProvider>
  );
}
