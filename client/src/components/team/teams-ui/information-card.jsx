import MoreButton from "./more-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeam } from "@/hooks/use-team";
import { formatDate } from "@/lib/teams-utils";

export default function InformationCard({ teamShow }) {
  const {
    setSelectedTeam,
    setSelectedProject,
    setIsOpenTeamDetails,
    setIsOpenProjectDetails,
    showData
  } = useTeam();

  return (
    <Card className="w-full max-h-80 gap-2 rounded-md shadow-none overflow-auto">
      <CardHeader>
        <div className="grid grid-cols-[1fr_auto] items-start">
          <div>
            <CardTitle className="w-full font-bold text-2xl line-clamp-2">
              {teamShow.name}
            </CardTitle>
          </div>
          <div className="flex items-start gap-4">
            {showData == "team" ? (
              <MoreButton
                object={teamShow}
                setOpenDetails={setIsOpenTeamDetails}
                setSelected={setSelectedTeam}
                manage={"team"}
                edit={true}
              />
            ) : (
              <MoreButton
                object={teamShow}
                setOpenDetails={setIsOpenProjectDetails}
                setSelected={setSelectedProject}
                manage={"project"}
                edit={true}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-sm font-medium">Description</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{teamShow?.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
