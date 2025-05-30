import ProjectActions from "@/components/team/actions/project-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";

export default function ProjectInformationCard() {
  const { selectedProject } = useProject();
  const { selectedTeam } = useTeam();

  return (
    <Card className="w-full gap-2 rounded-md shadow-none">
      <CardHeader>
        <div className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="w-full font-bold text-2xl line-clamp-2">
              {selectedProject.name}
            </CardTitle>
          </div>
          <ProjectActions project={selectedProject} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="text-sm font-semibold">Team</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{selectedTeam.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {selectedProject.description || "None"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
