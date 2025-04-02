"use client";

import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { projectMember, teams, teamsMember, users } from "@/data/teams.js";
import { DataTable } from "./MemberDataTable/data-table";
import { columns } from "./MemberDataTable/column";

const MembersTable = ({ props }) => {
	const { teamShow, setTeamShow, showData } = props;

	const [usersInTeam, setUsersInTeam] = useState(
		users.filter((user) => {
			if (showData == "team")
				return teamsMember.some(
					(team) =>
						team.userId == user.id && team.teamId == teamShow.id
				);
			else if (showData == "project")
				return projectMember.some(
					(project) =>
						project.userId == user.id &&
						project.projectId == teamShow.id
				);
		})
	);

	useEffect(() => {
		setUsersInTeam(
			users.filter((user) => {
				if (showData == "team")
					return teamsMember.some(
						(team) =>
							team.userId == user.id && team.teamId == teamShow.id
					);
				else if (showData == "project")
					return projectMember.some(
						(project) =>
							project.userId == user.id &&
							project.projectId == teamShow.id
					);
			})
		);
	}, [teamShow]);

	console.log(teamShow);

	return (
		<div className="w-full h-full px-3">
			<div>
				<h2 className="font-bold text-xl mb-3.5 py-2 px-5 capitalize">
					{teamShow.name}
				</h2>
			</div>
			<div>
				<DataTable columns={columns} data={usersInTeam} />
			</div>
			<div></div>
		</div>
	);
};

export default MembersTable;
