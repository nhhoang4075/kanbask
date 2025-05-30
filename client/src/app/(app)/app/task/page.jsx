"use client";

import TaskMain from "@/components/task/tasks-main";
import { TaskProvider } from "@/hooks/use-tasks";

export default function TaskPage() {
  return (
    <TaskProvider>
      <TaskMain />
    </TaskProvider>
  );
}
