"use client";

import { useMemo } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--color-green-500)"
  },
  remaining: {
    label: "Remaining",
    color: "var(--color-gray-200)"
  }
};

export default function ProgressChart() {
  const { selectedProject } = useProject();
  const { tasks } = useTask();

  // Calculate completion statistics
  const stats = useMemo(() => {
    if (!selectedProject || !tasks.length) return null;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const completionRate = Math.round((completedTasks / totalTasks) * 100);

    return {
      completed: completionRate,
      remaining: 100 - completionRate,
      total: totalTasks,
      completedCount: completedTasks
    };
  }, [selectedProject, tasks]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!stats) return [];
    return [
      {
        completed: stats.completed,
        remaining: stats.remaining
      }
    ];
  }, [stats]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No tasks found
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
      <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130}>
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {stats.completed}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 4}
                      className="fill-muted-foreground"
                    >
                      {stats.completedCount} of {stats.total} tasks
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        <RadialBar
          dataKey="remaining"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-gray-200)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="completed"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-green-500)"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  );
}
