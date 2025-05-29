import { FolderKanban, FileText, ListTodo, AlertCircle, CircleCheckBigIcon } from "lucide-react";

import StatsCard from "@/components/dashboard/stats-card";

export default function Stats({ tasks, projects }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 h-full">
      <StatsCard
        title="Total Projects"
        value={projects.length}
        description="Total number of projects"
        color="blue"
        itemIcon={<FolderKanban className="h-6 w-6 text-blue-500" />}
      />
      <StatsCard
        title="Total Tasks"
        value={tasks.length}
        description="Total number of tasks"
        color="amber"
        itemIcon={<ListTodo className="h-6 w-6 text-amber-500" />}
      />
      <StatsCard
        title="Tasks Completed"
        value={tasks.filter((task) => task.status === "done").length}
        description="Total number of completed tasks"
        color="green"
        itemIcon={<CircleCheckBigIcon className="h-6 w-6 text-green-500" />}
      />
      <StatsCard
        title="Pending Tasks"
        value={
          tasks.filter(
            (task) =>
              task.status === "todo" || task.status == "in_progress" || task.status == "review"
          ).length
        }
        description="Total number of pending tasks"
        color="purple"
        itemIcon={<FileText className="h-6 w-6 text-purple-500" />}
      />
      <StatsCard
        title="Overdue Tasks"
        value={
          tasks.filter(
            (task) => task.due_date < new Date() && task.status !== "done" && task.due_date
          ).length
        }
        description="Total number of overdue tasks"
        color="red"
        itemIcon={<AlertCircle className="h-6 w-6 text-red-500" />}
      />
    </div>
  );
}
