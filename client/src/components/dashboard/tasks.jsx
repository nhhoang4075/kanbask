import Link from "next/link";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";
import { cn, capitalCase } from "@/lib/utils";

const priorityOrder = { high: 1, medium: 2, low: 3 };

export default function Tasks({ tasks, projects }) {
  const { user } = useSession();
  const myTasks = tasks.filter((task) =>
    task.assignees.some((assignee) => assignee.user_id === user?.id)
  );

  // Sort tasks by due date and then by priority
  const sortedTasks = [...myTasks].sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);

    if (dateA - dateB !== 0) return dateA - dateB; // Sort by due date
    if (a.priority && b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority]; // Sort by priority
    return -(new Date(a.created_at) - new Date(b.created_at)); // Sort by created at (newest first)
  });

  return (
    <Card className="h-full flex flex-col md:col-start-4 md:col-span-2">
      <CardHeader className="text-xl shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>My Tasks</CardTitle>
        <Link href="/app/task" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="max-h-[440px] overflow-y-auto space-y-2 pr-2">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="group px-4 py-2 border rounded-md transition-colors duration-200 ease-in-out hover:bg-prussian-blue hover:text-mustard hover:cursor-pointer"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                <div>
                  <p className="text-lg font-medium truncate">{task.title}</p>
                  <p className="text-xs text-gray-500 truncate transition-colors group-hover:text-mustard">
                    {projects.find((project) => project.id === task.project_id)?.name ||
                      "No Project"}
                  </p>
                  <p className="text-muted-foreground text-sm mt-2 truncate transition-colors group-hover:text-white">
                    {`Due: 
                ${
                  task.due_date
                    ? new Date(task.due_date).toLocaleDateString("en-UK")
                    : "No due date"
                }`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 text-xs">
                  <Badge
                    className={cn(
                      "rounded-sm",
                      task.status === "done"
                        ? "bg-green-500"
                        : task.status === "todo" ||
                          task.status === "in_progress" ||
                          task.status === "review"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    )}
                  >
                    {task.status ? capitalCase(task.status) : "No Status"}
                  </Badge>
                  <Badge
                    className={cn(
                      "rounded-sm",
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-amber-500"
                        : task.status === "low"
                        ? "bg-green-500"
                        : "bg-gray-600"
                    )}
                  >
                    {task.priority ? capitalCase(task.priority) : "No Priority"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
