import SummaryChart from "@/components/dashboard/summary-chart";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useDashboard } from "@/hooks/use-dashboard";

export default function Summary() {
  const { projects, tasks, selectedProjectId, setSelectedProjectId } = useDashboard();

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white shadow-md md:col-span-3">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl m-0 p-0">Summary</CardTitle>
        <Select onValueChange={setSelectedProjectId} value={selectedProjectId} defaultValue={-1}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose project" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
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
        <SummaryChart selectedProjectId={selectedProjectId || -1} tasks={tasks} />
      </CardContent>
    </Card>
  );
}
