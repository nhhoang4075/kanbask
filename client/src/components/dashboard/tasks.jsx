import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Tasks({ tasks, projects }) {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const [hover, setHover] = useState(null);
  // Sort tasks by due date and then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    if (dateA - dateB !== 0) return dateA - dateB; // Sort by due date
    if (a.priority && b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority]; // Sort by priority
    return -(new Date(a.created_at) - new Date(b.created_at)); // Sort by created at (newest first)
  });

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden md:col-start-4 md:col-span-2">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Upcoming Tasks</CardTitle>
        <Link href="/app/tasks" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 space-y-3">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "p-3 border rounded transition-colors",
                hover === task.id && "bg-blue-green text-white"
              )}
              onMouseEnter={() => setHover(task.id)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="flex justify-between">
                <span className="font-medium">{task.title}</span>
                <div>
                  <Badge
                    className={`text-xs mr-2 ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : task.status === "low"
                        ? "bg-green-500"
                        : "bg-black"
                    }`}
                  >
                    {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) ||
                      "No Priority"}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      task.status === "done"
                        ? "bg-green-500"
                        : task.status === "todo" ||
                          task.status === "in_progress" ||
                          task.status === "review"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {task.status === "done"
                      ? "Completed"
                      : task.status === "todo"
                      ? "To do"
                      : task.status === "in_progress"
                      ? "In Progress"
                      : task.status === "overdue"
                      ? "Overdue"
                      : task.status === "review"
                      ? "Review"
                      : "Cancelled"}
                  </Badge>
                </div>
              </div>
              <div
                className={cn(
                  "text-xs text-gray-500 transition-colors",
                  hover === task.id && "text-white"
                )}
              >
                {projects.find((project) => project.id === task.project_id)?.name || "No Project"}
              </div>
              <div
                className={cn(
                  "text-muted-foreground text-sm mt-1 transition-colors",
                  hover === task.id && "text-white"
                )}
              >
                Due:{" "}
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString("en-UK")
                  : "No due date"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
