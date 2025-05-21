'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { projects, initialData } from "@/temp-data/data";
import Stats from "@/components/dashboard/stats";
import Tasks from "@/components/dashboard/tasks";
import Projects from "@/components/dashboard/projects";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Simulate data fetching
    setTimeout(() => {
      setTasks(initialData);
      setLoading(false);
    }, 1000);
  }, []);

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
        <div className="flex flex-col h-full gap-4 overflow-hidden">
          <div className="flex-shrink-0">
            <Stats tasks={tasks} projects={projects} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
            <Projects projects={projects} />
            <Tasks tasks={tasks} />
          </div>
        </div>
      )}
    </div>
  );
}