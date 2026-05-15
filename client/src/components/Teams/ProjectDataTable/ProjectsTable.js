"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/Teams/data-table";
import { columns } from "./column";
import { projectsData } from "@/data/teams";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";

const ProjectsTable = ({ props }) => {
	const { project, setProject } = props;

	useEffect(() => {}, []);

	return (
		<div className="w-full max-h-[calc(100vh-7rem)] px-3 overflow-y-auto pt-1.5 pb-1">
			{/* Display Project Properties */}
			<Card className="my-2 border-2 py-4 h-fit max-h-80 gap-1 overflow-auto">
				<CardHeader>
					<div className="grid grid-cols-[1fr_auto] items-start">
						<div>
							<CardTitle className="w-full font-bold text-3xl capitalize mb-2">
								{project.name}
							</CardTitle>
							<CardDescription className="mt-2">
								Created By: {project.createdBy}
							</CardDescription>
						</div>
						<div className="text-right text-sm text-muted-foreground">
							<div>Created At: {project.createdAt}</div>
							<div>Updated At: {project.updatedAt}</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<h3 className="font-medium">Description:</h3>
						<p className="text-sm text-muted-foreground text-ellipsis h-fit max-h-37 overflow-auto">
							{project?.description}
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Display Project Table */}
			<div>
				<DataTable
					columns={columns}
					data={projectsData}
					setFunction={setProject}
					manage={"project"}
				/>
			</div>
			<div></div>
		</div>
	);
};

export default ProjectsTable;
