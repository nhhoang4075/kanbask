import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";
import { getLastWeekDates } from "@/lib/utils";

export default function SummaryChart() {
  const { selectedProject } = useProject();
  const { tasks } = useTask();

  // Get the dates for the last 7 days
  const lastWeekDates = useMemo(() => getLastWeekDates(), []);
  // Chart configuration
  const chartConfig = {
    all: {
      label: "All",
      color: "var(--color-cyan-500)"
    },
    todo: {
      label: "Todo",
      color: "var(--color-yellow-500)"
    },
    in_progress: {
      label: "In Progress",
      color: "var(--color-blue-500)"
    },
    review: {
      label: "Review",
      color: "var(--color-indigo-500)"
    },
    done: {
      label: "Done",
      color: "var(--color-green-500)"
    },
    overdue: {
      label: "Overdue",
      color: "var(--color-red-500)"
    }
  };

  // Prepare chart data for the selected project
  const chartData = useMemo(() => {
    if (!selectedProject) return [];

    return lastWeekDates.map((date) => {
      // Format date for display
      const formattedDate = date.toLocaleDateString("en-UK", {
        weekday: "short",
        day: "numeric"
      });

      // Count all tasks for this project on this date
      const allTasks = tasks.filter((task) => {
        // Set createDate to 0h00 of that day
        const createDate = new Date(task.created_at);
        createDate.setHours(0, 0, 0, 0);

        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);

        return createDate <= date && date <= dueDate;
      });

      const todoTasks = allTasks.filter((task) => task.status === "todo");
      const inProgressTasks = allTasks.filter((task) => task.status === "in_progress");
      const reviewTasks = allTasks.filter((task) => task.status === "review");
      const doneTasks = allTasks.filter((task) => task.status === "done");

      // Count overdue tasks for this project on this date
      const overdueTasks = tasks.filter((task) => {
        if (task.status === "done") return false;

        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date > dueDate;
      });

      return {
        date: formattedDate,
        all: allTasks.length,
        todo: todoTasks.length,
        in_progress: inProgressTasks.length,
        review: reviewTasks.length,
        done: doneTasks.length,
        overdue: overdueTasks.length
      };
    });
  }, [selectedProject, tasks, lastWeekDates]);

  return (
    <ChartContainer config={chartConfig} className="max-w-full overflow-x-auto">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
        accessibilityLayer
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickMargin={10} />
        <ChartTooltip content={<ChartTooltipContent className="bg-white p-4 space-y-2" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="all"
          name="All"
          stroke="var(--color-cyan-500)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="todo"
          name="Todo"
          stroke="var(--color-yellow-500)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="in_progress"
          name="In Progress"
          stroke="var(--color-blue-500)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="review"
          name="Review"
          stroke="var(--color-indigo-500)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="done"
          name="Done"
          stroke="var(--color-green-500)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="overdue"
          name="Overdue"
          stroke="var(--color-red-500)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  );
}
