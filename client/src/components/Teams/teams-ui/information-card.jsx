import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamContext } from "@/hooks/use-teams";
import React, { useEffect } from "react";
import MoreButton from "./more-button";
import { formatDate } from "@/lib/teams-utils";

const InforCard = ({ teamShow }) => {
  const {
    setSelectedTeam,
    setSelectedProject,
    setIsOpenTeamDetails,
    setIsOpenProjectDetails,
    showData
  } = useTeamContext();

  return (
    <Card className="w-full my-2 border-2 py-4 h-fit max-h-80 gap-1 overflow-auto">
      <CardHeader>
        <div className="grid grid-cols-[1fr_auto] items-start">
          <div>
            <CardTitle className="w-full font-bold text-3xl capitalize mb-2">
              {teamShow.name}
            </CardTitle>
          </div>
          <div className="flex items-start gap-4">
            <div className="text-right text-sm text-muted-foreground">
              <div>Created At: {formatDate(teamShow.created_at)}</div>
              <div>Updated At: {formatDate(teamShow.updated_at)}</div>
            </div>
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
        <div className="space-y-2">
          <h3 className="font-medium">Description:</h3>
          <p className="text-sm text-muted-foreground text-ellipsis h-fit max-h-37 overflow-auto">
            {teamShow?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InforCard;
