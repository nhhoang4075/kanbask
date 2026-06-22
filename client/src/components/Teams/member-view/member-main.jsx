"use client";

import React, { useEffect, useState } from "react";
import MemberDataTable from "./member-table";
import { useTeamContext } from "@/hooks/use-teams";
import InforCard from "../teams-ui/information-card";

const MembersTable = () => {
  const { selectedTeam, selectedProject, showData } = useTeamContext();

  const [teamShow, setTeamShow] = useState(selectedTeam);

  useEffect(() => {
    setTeamShow(() => {
      if (showData == "team") {
        return selectedTeam;
      } else if (showData == "project") {
        return selectedProject;
      }
    });
  }, [selectedTeam, selectedProject, showData]);

  return (
    <div className="w-full px-3 overflow-y-auto col-span-7 space-y-4 h-[calc(100vh-7rem)]">
      {teamShow && (
        <>
          <InforCard teamShow={teamShow} />

          <div className="w-full overflow-auto">
            <MemberDataTable teamShow={teamShow} showData={showData} manage={"members"} />
          </div>
        </>
      )}
    </div>
  );
};

export default MembersTable;
