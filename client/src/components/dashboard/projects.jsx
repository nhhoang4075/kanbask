import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function Projects({ projects, tasks }) {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Recent Projects</CardTitle>
        <Link href="/app/projects" className="text-sm text-blue-500 hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 space-y-4">
          {projects.map(project => (
            <div key={project.id} className="space-y-2">
              <div className="flex justify-between">
                <span>{project.name}</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}