"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";
import { capitalCase } from "@/lib/utils";

const PRIORITY_ORDER = ["high", "medium", "low"];

const chartConfig = {
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
  }
};

export default function PriorityChart() {
  const { selectedProject } = useProject();
  const { tasks } = useTask();

  // Prepare chart data for the selected project
  const chartData = useMemo(() => {
    if (!selectedProject || !tasks.length) return [];

    // Initialize data structure for each priority
    const priorityData = PRIORITY_ORDER.map((priority) => ({
      priority: capitalCase(priority),
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
      total: 0
    }));

    // Count tasks for each priority and status
    tasks.forEach((task) => {
      if (!task.priority) return;

      const priorityIndex = PRIORITY_ORDER.indexOf(task.priority);
      if (priorityIndex === -1) return;

      priorityData[priorityIndex][task.status] += 1;
      priorityData[priorityIndex].total += 1;
    });

    return priorityData;
  }, [selectedProject, tasks]);

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-medium mb-2">{label} Priority</p>
        <div className="space-y-1">
          <p className="flex items-center justify-between gap-4">
            <span>Total:</span>
            <span className="font-semibold">{payload[0].payload.total}</span>
          </p>
          {payload.map((entry) => (
            <p
              key={entry.dataKey}
              style={{ color: chartConfig[entry.dataKey].color }}
              className="flex items-center justify-between gap-4"
            >
              <span>{chartConfig[entry.dataKey].label}:</span>
              <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No tasks found
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
        barGap={0}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="priority" tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickMargin={10} />
        <ChartTooltip
          content={<CustomTooltip />}
          cursor={{ fill: "var(--color-accent)", opacity: 0.1 }}
        />
        <Bar dataKey="todo" stackId="a" fill="var(--color-yellow-500)" name="Todo" />
        <Bar dataKey="in_progress" stackId="a" fill="var(--color-blue-500)" name="In Progress" />
        <Bar dataKey="review" stackId="a" fill="var(--color-indigo-500)" name="Review" />
        <Bar dataKey="done" stackId="a" fill="var(--color-green-500)" name="Done" />
      </BarChart>
    </ChartContainer>
  );
}
