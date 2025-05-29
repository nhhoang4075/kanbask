"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import Stats from "@/components/dashboard/stats";
import Tasks from "@/components/dashboard/tasks";
import Summary from "@/components/dashboard/summary";

export default function DashboardContent() {
  const { loading, projects, tasks } = useDashboard();

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-1/4 w-full flex-shrink-0" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 min-h-0 overflow-scroll">
          <div className="p-2">
            <Stats tasks={tasks} projects={projects} />
          </div>
          <div className="flex-1 grid grid-cols-1 grid-rows-1 md:grid-cols-5 gap-4 min-h-0 p-2">
            <Summary projects={projects} />
            <Tasks tasks={tasks} projects={projects} />
          </div>
        </div>
      )}
    </div>
  );
}
