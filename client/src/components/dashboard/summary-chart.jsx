import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { getLastWeekDates } from "@/lib/dashboard-utils";

export default function SummaryChart({ selectedProjectId, tasks }) {
  // Get the dates for the last 7 days
  const lastWeekDates = useMemo(() => getLastWeekDates(), []);
  // Chart configuration
  const chartConfig = {
    all: {
      label: "All",
      color: "var(--color-amber-500)"
    },
    todo: {
      label: "Todo",
      color: "var(--color-purple-500)"
    },
    in_progress: {
      label: "In Progress",
      color: "var(--color-blue-500)"
    },
    review: {
      label: "Review",
      color: "var(--color-cyan-500)"
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
    if (!selectedProjectId) return [];

    return lastWeekDates.map((date) => {
      // Format date for display
      const formattedDate = date.toLocaleDateString("en-UK", {
        weekday: "short",
        day: "numeric"
      });
      // Count completed tasks for this project on this date
      const completedCount = tasks.filter((task) => {
        if (task.project_id !== selectedProjectId) return false;
        if (!task.completed_at) return false;
        if (!task.completed_at && task.status == "done") {
          const newCompleteDate = new Date(task.created_at).toLocaleDateString();
          return newCompleteDate == date.toLocaleDateString();
        }
        const completeDate = new Date(task.completed_at).toLocaleDateString();
        return completeDate == date.toLocaleDateString();
      }).length;

      // Count to do tasks for this project on this date
      const todoCount = tasks.filter((task) => {
        if (task.project_id !== selectedProjectId && selectedProjectId !== -1) return false;
        if (task.status !== "todo") return false;
        // A task is considered "exist" if the day is between the create date and due date
        const createDate = new Date(task.created_at);
        // Due date is consider infinite if null
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date <= dueDate;
      }).length;

      // Count in progress tasks for this project on this date
      const inProgressCount = tasks.filter((task) => {
        if (task.project_id !== selectedProjectId && selectedProjectId !== -1) return false;
        if (task.status !== "in_progress") return false;
        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date <= dueDate;
      }).length;

      const reviewCount = tasks.filter((task) => {
        if (task.project_id !== selectedProjectId && selectedProjectId !== -1) return false;
        if (task.status !== "review") return false;
        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date <= dueDate;
      }).length;

      // Count overdue tasks for this project on this date
      const overdueCount = tasks.filter((task) => {
        if (task.project_id !== selectedProjectId && selectedProjectId !== -1) return false;
        if (task.status === "done") return false;
        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return date > dueDate && createDate <= date;
      }).length;

      // Count all tasks for this project on this date
      const allCount = tasks.filter((task) => {
        if (task.project_id !== selectedProjectId && selectedProjectId !== -1) return false;
        const createDate = new Date(task.created_at);
        const dueDate = task.due_date ? new Date(task.due_date) : new Date(9999, 11, 31);
        return createDate <= date && date <= dueDate;
      }).length;

      return {
        date: formattedDate,
        all: allCount,
        todo: todoCount,
        in_progress: inProgressCount,
        review: reviewCount,
        done: completedCount,
        overdue: overdueCount
      };
    });
  }, [selectedProjectId, tasks, lastWeekDates]);

  return (
    <ChartContainer config={chartConfig} className="max-w-full overflow-x-auto">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
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
          stroke="var(--color-amber-500)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="todo"
          name="Todo"
          stroke="var(--color-purple-500)"
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
          stroke="var(--color-cyan-500)"
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
