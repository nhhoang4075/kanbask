import { getLastWeekDates } from "@/lib/dashboard-utils";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useMemo } from "react";
export default function SummaryChart({ chosenProjectId, tasks }) {
  // Get the dates for the last 7 days
  const lastWeekDates = useMemo(() => getLastWeekDates(), []);
  // Chart configuration
  const chartConfig = {
    done: {
      label: "Done Tasks",
      color: "var(--color-green-500)",
    },
    todo: {
      label: "Pending Tasks",
      color: "var(--color-purple-500)",
    },
    all: {
      label: "All Tasks",
      color: "var(--color-amber-500)",
    },
    overdue: {
      label: "Overdue Tasks",
      color: "var(--color-red-500)",
    },
    inprogress: {
      label: "In Progress Tasks",
      color: "var(--color-blue-500)",
    }
  };
  
  // Prepare chart data for the selected project
  const chartData = useMemo(() => {
    if (!chosenProjectId) return [];
    
    return lastWeekDates.map(date => {
      // Format date for display
      const formattedDate = date.toLocaleDateString("en-UK", { 
        weekday: 'short', 
        day: 'numeric' 
      });
      // Count completed tasks for this project on this date
      const completedCount = tasks.filter(task => {
        if (task.project_id !== chosenProjectId) return false;
        if (!task.complete_at) return false;
        if (!task.complete_at && task.status == "done") {
          const newCompleteDate = new Date(task.created_at).toLocaleDateString();
          return newCompleteDate == date.toLocaleDateString();
        }; 
        const completeDate = new Date(task.complete_at).toLocaleDateString();
        return completeDate == date.toLocaleDateString();
      }).length;

      // Count to do tasks for this project on this date
      const todoCount = tasks.filter(task => {
        if (task.project_id !== chosenProjectId && chosenProjectId !== -1) return false;
        if (task.status !== "todo") return false;
        // A task is considered "exist" if the day is between the create date and due date
        const createDate = new Date(task.created_at);
        // Due date is consider infinite if null
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date <= dueDate;
      }).length;

      // Count in progress tasks for this project on this date
      const inProgressCount = tasks.filter(task => {
        if (task.project_id !== chosenProjectId && chosenProjectId !== -1) return false;
        if (task.status !== "in_progress") return false;
        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date <= dueDate;
      }).length;

      // Count overdue tasks for this project on this date
      const overdueCount = tasks.filter(task => {
        if (task.project_id !== chosenProjectId && chosenProjectId !== -1) return false;
        if (task.status === "done") return false;
        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return date > dueDate && createDate <= date;
      }).length;

      // Count all tasks for this project on this date
      const allCount = tasks.filter(task => {
        if (task.project_id !== chosenProjectId && chosenProjectId !== -1) return false;
        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date <= dueDate;
      }).length;
      
      return {
        date: formattedDate,
        todo: todoCount,
        done: completedCount,
        overdue: overdueCount,
        inprogress: inProgressCount,
        all: allCount,
      };
    });
  }, [chosenProjectId, tasks, lastWeekDates]);
  console.log("Chart Data:", chartData);
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickMargin={10}
        />
        <YAxis 
          allowDecimals={false}
          tick={{ fontSize: 12 }} 
          tickMargin={10}
        />
        <ChartTooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 border rounded-md shadow-md">
                  <div className="space-y-2">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-700">
                          {entry.name}: <span className="font-medium">{entry.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                    {data.done > 0
                      ? `${Math.round((data.done / data.all) * 100)}% complete`
                      : "No tasks completed"
                    }
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle" 
          iconSize={10}
          wrapperStyle={{ paddingRight: 10, paddingBottom: 20 }}
        />
        <Line
          type="monotone"
          dataKey="all"
          name="All Tasks"
          stroke="var(--color-amber-500)"
          strokeWidth={2}
          activeDot={{ r: 6, stroke: "var(--color-amber-500)", strokeWidth: 2, fill: "white" }}
          dot={{ r: 4, stroke: "var(--color-amber-500)", strokeWidth: 2, fill: "white" }}
        />
        <Line
          type="monotone"
          dataKey="todo"
          name="To Do Tasks"
          stroke="var(--color-purple-500)"
          strokeWidth={2}
          activeDot={{ r: 6, stroke: "var(--color-purple-500)", strokeWidth: 2, fill: "white" }}
          dot={{ r: 4, stroke: "var(--color-purple-500)", strokeWidth: 2, fill: "white" }}
        />
        <Line
          type="monotone"
          dataKey="inprogress"
          name="In Progress Tasks"
          stroke="var(--color-blue-500)"
          strokeWidth={2}
          activeDot={{ r: 6, stroke: "var(--color-blue-500)", strokeWidth: 2, fill: "white" }}
          dot={{ r: 4, stroke: "var(--color-blue-500)", strokeWidth: 2, fill: "white" }}
        />
        <Line
          type="monotone"
          dataKey="overdue"
          name="Overdue Tasks"
          stroke="var(--color-red-500)"
          strokeWidth={2}
          activeDot={{ r: 6, stroke: "var(--color-red-500)", strokeWidth: 2, fill: "white" }}
          dot={{ r: 4, stroke: "var(--color-red-500)", strokeWidth: 2, fill: "white" }}
        />
        <Line
          type="monotone"
          dataKey="done"
          name="Tasks Completed"
          stroke="var(--color-green-500)"
          strokeWidth={2}
          activeDot={{ r: 6, stroke: "var(--color-green-500)", strokeWidth: 2, fill: "white" }}
          dot={{ r: 4, stroke: "var(--color-green-500)", strokeWidth: 2, fill: "white" }}
        />
      </LineChart>
    </ChartContainer>
  );
}