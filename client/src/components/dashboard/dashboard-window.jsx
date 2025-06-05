"use client";

import { useEffect } from "react";

import WorkloadCard from "@/components/dashboard/workload-card";
import PriorityCard from "@/components/dashboard/priority-card";
import ProgressCard from "@/components/dashboard/progress-card";
import SummaryCard from "@/components/dashboard/summary-card";
import TasksCard from "@/components/dashboard/tasks-card";
import { useTask } from "@/hooks/use-task";

export default function DashboardWindow() {
  const { fetchMyAssignedTasks } = useTask();

  useEffect(() => {
    fetchMyAssignedTasks();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 min-h-0 overflow-scroll">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 p-2">
          <div className="col-span-1 md:col-span-3">
            <PriorityCard />
          </div>
          <div className="col-span-1 md:col-span-3">
            <ProgressCard />
          </div>
          <div className="col-span-1 md:col-span-4">
            <WorkloadCard />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 grid-rows-1 md:grid-cols-10 gap-4 min-h-0 p-2">
          <div className="col-span-1 md:col-span-6">
            <SummaryCard />
          </div>
          <div className="col-span-1 md:col-span-4">
            <TasksCard />
          </div>
        </div>
      </div>
    </div>
  );
}
