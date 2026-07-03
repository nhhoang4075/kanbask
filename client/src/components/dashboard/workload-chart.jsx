"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useProject } from "@/hooks/use-project";
import { useTask } from "@/hooks/use-task";

const CHART_COLORS = [
  "#669900",
  "#99cc33",
  "#ccee66",
  "#006699",
  "#3399cc",
  "#990066",
  "#cc3399",
  "#ff6600",
  "#ff9900",
  "#ffcc00"
];

const RADIAN = Math.PI / 180;

export default function WorkloadChart() {
  const { selectedProject, projectMembers } = useProject();
  const { tasks } = useTask();

  // Prepare chart data for the selected project
  const chartData = useMemo(() => {
    if (!selectedProject || !tasks.length) return [];

    // Create a map to store task counts per user
    const userTaskCounts = new Map();

    // Initialize counts for all project members
    projectMembers.forEach((member, index) => {
      // Get color by index, repeating colors if needed
      const colorIndex = index % CHART_COLORS.length;

      userTaskCounts.set(member.id, {
        id: member.id,
        name: member.full_name,
        value: 0,
        todo: 0,
        done: 0,
        in_progress: 0,
        review: 0,
        color: CHART_COLORS[colorIndex]
      });
    });

    // Count tasks for each user
    tasks.forEach((task) => {
      task.assignees.forEach((assignee) => {
        const userStats = userTaskCounts.get(assignee.user_id);
        if (userStats) {
          userStats.value++;
          switch (task.status) {
            case "todo":
              userStats.todo++;
              break;
            case "in_progress":
              userStats.in_progress++;
              break;
            case "review":
              userStats.review++;
              break;
            case "done":
              userStats.done++;
              break;
          }
        }
      });
    });

    // Convert map to array and filter out users with no tasks
    return Array.from(userTaskCounts.values()).filter((user) => user.value > 0);
  }, [selectedProject, tasks, projectMembers]);

  // Chart configuration
  const chartConfig = useMemo(
    () =>
      chartData.reduce((acc, item) => {
        acc[item.id] = {
          label: item.name,
          color: item.color
        };
        return acc;
      }, {}),
    [chartData]
  );

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, name }) => {
    const radius = outerRadius * 1.3; // Increase this value to push labels further out
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs"
      >
        {name}
      </text>
    );
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-medium mb-2">{data.name}</p>
        <div className="space-y-1">
          <p className="flex items-center justify-between gap-4">
            <span>Total:</span>
            <span className="font-semibold">{data.value}</span>
          </p>
          <p className="flex items-center justify-between gap-4 text-yellow-500">
            <span>Todo:</span>
            <span className="font-semibold">{data.todo}</span>
          </p>
          <p className="flex items-center justify-between gap-4 text-blue-500">
            <span>In Progress:</span>
            <span className="font-semibold">{data.in_progress}</span>
          </p>
          <p className="flex items-center justify-between gap-4 text-indigo-500">
            <span>Review:</span>
            <span className="font-semibold">{data.review}</span>
          </p>
          <p className="flex items-center justify-between gap-4 text-green-500">
            <span>Done:</span>
            <span className="font-semibold">{data.done}</span>
          </p>
        </div>
      </div>
    );
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No tasks assigned yet
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <PieChart margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={75}
          paddingAngle={2}
          label={renderCustomizedLabel}
          labelLine={true}
        >
          {chartData.map((entry) => (
            <Cell key={entry.id} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<CustomTooltip />} />
      </PieChart>
    </ChartContainer>
  );
}
