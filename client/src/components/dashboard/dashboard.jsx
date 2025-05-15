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
    <>
      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        </div>
      ) : (
        <>
          <Stats tasks={tasks} projects={projects} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Projects projects={projects} />
            <Tasks tasks={tasks} />
          </div>
        </>
      )}
    </>
  );
}