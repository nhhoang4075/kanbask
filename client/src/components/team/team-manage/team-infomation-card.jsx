import TeamActions from "@/components/team/actions/team-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/hooks/use-team";

export default function TeamInformationCard() {
  const { selectedTeam } = useTeam();

  return (
    <Card className="w-full gap-2 rounded-md shadow-none">
      <CardHeader>
        <div className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="w-full font-bold text-2xl line-clamp-2">
              {selectedTeam.name}
            </CardTitle>
          </div>
          <TeamActions team={selectedTeam} />
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-semibold">Description</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {selectedTeam.description || "None"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
