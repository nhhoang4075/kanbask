import AppHeader from "@/components/app/app-header";
import TaskHeader from "@/components/task/task-header";

export const metadata = {
  title: "Task",
  description: "Your Kanbask task"
};

export default function TaskLayout({ children }) {
  return (
    <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
      <AppHeader name="Task">
        <TaskHeader />
      </AppHeader>
      <div className="flex-1 overflow-auto rounded-md">{children}</div>
    </div>
  );
}
