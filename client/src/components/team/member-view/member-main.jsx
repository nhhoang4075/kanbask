"use client";

import { useEffect, useState } from "react";

import InforCard from "../teams-ui/information-card";
import MemberTable from "@/components/team/member-view/member-table";
import { useTeam } from "@/hooks/use-team";

export default function MemberTab() {
  const { selectedTeam } = useTeam();

  const [teamShow, setTeamShow] = useState(selectedTeam);

  useEffect(() => {
    setTeamShow(() => {
      // if (showData == "team") {
      //   return selectedTeam;
      // } else if (showData == "project") {
      //   return selectedProject;
      // }
      return selectedTeam;
    });
  }, [selectedTeam]);

  return (
    <div className="w-full px-6 py-4 overflow-y-auto space-y-4">
      {teamShow && (
        <>
          <InforCard teamShow={teamShow} />

          <div className="w-full overflow-auto">
            <MemberTable teamShow={teamShow} manage={"members"} />
          </div>
        </>
      )}
    </div>
  );
}
