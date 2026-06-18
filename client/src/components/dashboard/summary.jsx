import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState, useEffect } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import SummaryChart from "./summary-chart";

export default function Summary() {
  const { projects, tasks } = useDashboard();
  const [chosenProjectId, setChosenProjectId] = useState(projects[0]?.id || null);
  // Set the initial chosen project ID to the first project in the list
  useEffect(() => {
    if (projects.length > 0) {
      setChosenProjectId(projects[0].id);
    }
    console.log(tasks);
  }, [projects]);
  
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden bg-white shadow-md">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl m-0 p-0">Summary</CardTitle>
        <Select onValueChange={setChosenProjectId} value={chosenProjectId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
            <SelectItem value={-1}>All Projects</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {chosenProjectId ? (
          <SummaryChart
            chosenProjectId={chosenProjectId}
            tasks={tasks}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Please select a project to view task completion data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}