'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import Stats from "@/components/dashboard/stats";
import Tasks from "@/components/dashboard/tasks";
import Summary from "@/components/dashboard/summary";

export default function Dashboard() { 
  const { loading, projects, tasks } = useDashboard();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {loading ? (
        <div className="flex flex-col space-y-3 h-full">
          <Skeleton className="h-[125px] w-full flex-shrink-0" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full gap-4 overflow-hidden bg-ghost-white">
          <div className="flex-shrink-0">
            <Stats tasks={tasks} projects={projects}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden bg-ghost-white">
            <Summary projects={projects} />
            <Tasks tasks={tasks} projects={projects}/>
          </div>
        </div>
      )}
    </div>
  );
}