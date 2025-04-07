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

	return (
		<div className="w-full px-3 h-full overflow-auto col-span-7">
			{/* Display properties */}
			<div className="grid grid-cols-5 h-fit max-h-80 my-3 gap-1 overflow-auto">
				<div className="col-span-4 h-full bg-gray-100 rounded-lg shadow-xs border-2 border-gray-600 py-3 px-6 overflow-hidden">
					<h2 className="font-bold text-3xl capitalize overflow-x-auto mb-2 py-2">
						{teamShow.name}
					</h2>
					<p className="text-base text-start overflow-auto text-gray-500">
						Created By: {teamShow.createdBy}
					</p>
					<p className="text-base">Description:</p>
					<div className="text-base text-black text-ellipsis h-fit max-h-37 overflow-auto">
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
			<div className="w-full overflow-auto">
				<DataTable
					columns={columns}
					data={usersInTeam}
					setFunction={null}
					manage={"member"}
				/>
			</div>
		</div>
	);
};

export default MembersTable;
