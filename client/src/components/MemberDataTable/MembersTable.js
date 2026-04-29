"use client";

import React, { useEffect, useState } from "react";
import { projectMember, teams, teamsMember, users } from "@/data/teams.js";
import { columns } from "./column";
import { DataTable } from "./data-table";

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

	return (
		<div className="w-full h-full px-3 mt-2">
			{/* Display properties */}
			<div className="flex justify-between mb-2">
				<div>
					<h2 className="font-bold text-xl py-2 px-5 capitalize">
						{teamShow.name}
					</h2>
					<p className="text-sm text-black px-5 capitalize">
						{teamShow.description}
					</p>
				</div>
				<div className="flex flex-col gap-1 my-2">
					<p className="text-sm text-end text-gray-500 px-5 capitalize">
						Created At: {teamShow.createAt}
					</p>
					<p className="text-sm text-end text-gray-500 px-5 capitalize">
						Updated At: {teamShow.updateAt}
					</p>
				</div>
			</div>

			{/*Display data  */}
			<div className="w-full">
				<DataTable columns={columns} data={usersInTeam} />
			</div>
		</div>
	);
};

export default MembersTable;
