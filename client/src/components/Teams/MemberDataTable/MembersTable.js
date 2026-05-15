"use client";

import React, { useEffect, useState } from "react";
import { projectMember, teams, teamsMember, users } from "@/data/teams.js";
import { columns } from "./column";
import { DataTable } from "@/components/Teams/data-table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";

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
		<div className="w-full px-3 overflow-y-auto col-span-7 space-y-4 max-h-[calc(100vh-7rem)]">
			{/* Display properties */}
			<Card className="my-2 border-2 py-4 h-fit max-h-80 gap-1 overflow-auto">
				<CardHeader>
					<div className="grid grid-cols-[1fr_auto] items-start">
						<div>
							<CardTitle className="w-full font-bold text-3xl capitalize mb-2">
								{teamShow.name}
							</CardTitle>
							<CardDescription className="mt-2">
								Created By: {teamShow.createdBy}
							</CardDescription>
						</div>
						<div className="text-right text-sm text-muted-foreground">
							<div>Created At: {teamShow.createdAt}</div>
							<div>Updated At: {teamShow.updatedAt}</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<h3 className="font-medium">Description:</h3>
						<p className="text-sm text-muted-foreground text-ellipsis h-fit max-h-37 overflow-auto">
							{teamShow?.description}
						</p>
					</div>
				</CardContent>
			</Card>

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
