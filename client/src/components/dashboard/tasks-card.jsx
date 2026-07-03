import Link from "next/link";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";
import { cn, capitalCase } from "@/lib/utils";
import { pickStatusColor, pickPriorityColor } from "@/lib/task-utils";

const priorityOrder = { high: 1, medium: 2, low: 3 };

export default function TasksCard() {
  const { myAssignedTasks } = useTask();
  const { selectedTeam } = useTeam();
  const { projects } = useProject();

  const myUpcomingTasks = myAssignedTasks.slice(0, 10);

  // Sort tasks by due date and then by priority
  const sortedTasks = myUpcomingTasks.sort((a, b) => {
    const dueDateA = a.due_date ? new Date(a.due_date) : null;
    const dueDateB = b.due_date ? new Date(b.due_date) : null;

    // Sort by due date - tasks with dates come first
    if (dueDateA && !dueDateB) return -1;
    if (!dueDateA && dueDateB) return 1;
    if (dueDateA && dueDateB && dueDateA - dueDateB !== 0) return dueDateA - dueDateB;

    // If both dates are null, sort by priority - tasks with priority come first
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    if (a.priority && b.priority && a.priority !== b.priority)
      return priorityOrder[a.priority] - priorityOrder[b.priority];

    // If both dates and priorities are null, sort by created_at
    return -(new Date(a.created_at) - new Date(b.created_at)); // Newest first
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="text-xl shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>My Assigned Tasks</CardTitle>
        <Link href="/app/task" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="max-h-[440px] overflow-y-auto space-y-2 pr-2">
          {sortedTasks.map((task) => (
            <TooltipProvider key={task.id}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div
                    className="px-4 py-2 border rounded-md transition-colors duration-200 ease-in-out hover:bg-muted/50 hover:cursor-pointer"
                    onClick={() =>
                      window.open(
                        `/app/task?team=${task.team_id}&project=${task.project_id}&task=${task.id}`,
                        "_self"
                      )
                    }
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                      <div>
                        <p className="text-md font-medium truncate">{task.title}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {projects[selectedTeam?.id]?.find(
                            (project) => project.id === task.project_id
                          )?.name || "No Project"}
                        </p>
                        <p className="text-muted-foreground text-sm mt-2 truncate">
                          {`Due: ${
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
                            task.status ? pickStatusColor(task.status) : "bg-gray-600"
                          )}
                        >
                          {task.status ? capitalCase(task.status) : "No Status"}
                        </Badge>
                        <Badge
                          className={cn(
                            "rounded-sm",
                            task.priority ? pickPriorityColor(task.priority) : "bg-gray-600"
                          )}
                        >
                          {task.priority ? capitalCase(task.priority) : "No Priority"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-prussian-blue text-white text-xs">
                  Go to task
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
