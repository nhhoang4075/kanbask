"use client";

import MemberSideBar from "@/components/Teams/MemberDataTable/MemberSideBar";
import MembersTable from "@/components/Teams/MemberDataTable/MembersTable";
import { projectMember, teams, teamsMember, users } from "@/data/teams";
import React, { useEffect, useState } from "react";

const Member = () => {
  // showData is used to show teams or project
  const [showData, setShowData] = useState("team");

  // teamShow is used to show the team or project selected
  const [teamShow, setTeamShow] = useState(teams[0]);

  const props = {
    showData,
    setShowData,
    teamShow,
    setTeamShow
  };

  return (
    <div className="grid grid-cols-9 h-full max-h-[calc(100vh-140px)] overflow-hidden w-full bg-white rounded-b-2xl">
      <MemberSideBar props={props} />
      <MembersTable props={props} />
    </div>
  );
};

export default Member;
