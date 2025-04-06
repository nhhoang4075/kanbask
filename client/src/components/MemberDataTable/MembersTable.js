"use client";

import React, { useEffect, useState } from "react";
import { projectMember, teams, teamsMember, users } from "@/data/teams.js";
import { columns } from "./column";
import { DataTable } from "@/components/data-table";

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
		<div className="w-full h-[calc(100vh-140px)] px-3 overflow-auto">
			{/* Display properties */}
			<div className="grid grid-cols-5 h-fit max-h-60 my-3 gap-1.5">
				<div className="col-span-4 h-full bg-gray-100 rounded-lg shadow-xs border-2 border-gray-600 py-3 px-4">
					<h2 className="font-bold text-2xl capitalize mb-1">
						{teamShow.name}
					</h2>
					<p className="text-sm text-start text-gray-500">
						Created By: {teamShow.createdBy}
					</p>
					<p className="">Description:</p>
					<div className="text-base h-fit max-h-37 overflow-auto">
						{teamShow.description}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-x-1.5 my-2 h-15">
					<p className="text-sm text-end text-gray-500 capitalize">
						Created At:
					</p>
					<p className="text-sm text-start text-gray-500 capitalize">
						{teamShow.createdAt}
					</p>
					<p className="text-sm text-end text-gray-500 capitalize">
						Updated At:
					</p>
					<p className="text-sm text-start text-gray-500 capitalize">
						{teamShow.updatedAt}
					</p>
				</div>
			</div>

			{/*Display data  */}
			<div className="w-full">
				<DataTable
					columns={columns}
					data={usersInTeam}
					setFunction={null}
				/>
			</div>
		</div>
	);
};

export default MembersTable;
