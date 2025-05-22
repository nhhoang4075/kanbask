import { getUserTeams } from "@/actions/teams-actions";
import Teams from "@/components/Teams/teams-main";
import { TeamProvider } from "@/hooks/use-teams";
import React from "react";

const TeamsPage = async () => {
  const teamsData = await getUserTeams();

  return (
    <TeamProvider initialTeamsData={teamsData}>
      <Teams />
    </TeamProvider>
  );
};

export default TeamsPage;
