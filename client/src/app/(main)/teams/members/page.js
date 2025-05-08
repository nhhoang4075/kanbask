"use client";

import MemberSideBar from "@/components/Teams/TeamSideBar";
import MembersTable from "@/components/Teams/MemberView/MembersTable";
import { teams } from "@/data/teams";
import React, { useState } from "react";

const Member = () => {
  // showData is used to show teams or project

  return (
    <div className="grid grid-cols-9 overflow-hidden w-full">
      <MembersTable props={props} />
    </div>
  );
};

export default Member;
