import AppHeader from "@/components/app/app-header";
import { TaskProvider } from "@/hooks/use-tasks";

export const metadata = {
  title: "Task",
  description: "Your Kanbask task"
};

export default function TaskLayout({ children }) {
  return (
    <TaskProvider>
      <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
        <AppHeader name="Task" />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </TaskProvider>
  );
}
