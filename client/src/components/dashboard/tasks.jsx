import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";

export default function Tasks({ tasks }) {
  // Sort tasks by priority (High > Medium > Low)
  const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
  
  const sortedTasks = [...tasks].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Upcoming Tasks</CardTitle>
        <Link href="/app/tasks" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 space-y-3">
          {sortedTasks.map(task => (
            <div key={task.id} className="p-3 border rounded hover:bg-accent transition-colors">
              <div className="flex justify-between">
                <span className="font-medium">{task.title}</span>
                <Badge variant={
                  task.priority === 'High' ? "destructive" : 
                  task.priority === 'Medium' ? "warning" : 
                  "success"
                }>
                  {task.priority}
                </Badge>
              </div>
              <div className="text-muted-foreground text-sm">Due: {task.dueDate}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}