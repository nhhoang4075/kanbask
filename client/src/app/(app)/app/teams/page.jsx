import { getUserTeams } from "@/actions/teams-actions";
import Teams from "@/components/teams/teams-main";
import { teams } from "@/data/teams";
import { TeamProvider } from "@/hooks/use-teams";
import React from "react";

const TeamsPage = async () => {
  return (
    <TeamProvider>
      <Teams />
    </TeamProvider>
  );
};

export default TeamsPage;
