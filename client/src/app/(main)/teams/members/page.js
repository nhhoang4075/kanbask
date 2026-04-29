"use client";

import MemberSideBar from "@/components//MemberDataTable/MemberSideBar";
import MembersTable from "@/components/MemberDataTable/MembersTable";
import { teams } from "@/data/teams";
import React, { useState } from "react";

const Member = () => {
	// showData is used to show teams or project
	const [showData, setShowData] = useState("team");

	// teamShow is used to show the team or project selected
	const [teamShow, setTeamShow] = useState(teams[0]);

	const props = {
		showData,
		setShowData,
		teamShow,
		setTeamShow,
	};

	return (
		<div className="flex h-full">
			<MemberSideBar props={props} />
			<MembersTable props={props} />
		</div>
	);
};

export default Member;
