import TaskWindow from "@/components/task/task-window";
import TaskMain from "@/components/task/tasks-main";
import { TaskProvider } from "@/hooks/use-tasks";

export default function TaskPage() {
  return (
    <TaskProvider>
      <TaskWindow />
    </TaskProvider>
  );
}
