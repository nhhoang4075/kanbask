"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { projectsData } from "@/data/teams";

const ProjectsTable = ({ props }) => {
	const { project, setProject } = props;
	console.log("Project: ", project);

	useEffect(() => {}, []);

	return (
		<div className="w-full h-full px-3">
			{/* Display Project Properties */}
			<div className="grid grid-cols-5 h-45 my-3">
				<div className="col-span-4 h-full bg-gray-100 rounded-lg shadow-md py-3 px-4">
					<h2 className="font-bold text-2xl capitalize mb-1">
						{project.name}
					</h2>
					<p className="text-sm text-start text-gray-500">
						Created By: {project.createdBy}
					</p>
					<p className="text-base text-blackcapitalize my-2.5	">
						Description: {project.description}
					</p>
				</div>
				<div className="grid grid-cols-2 gap-x-1.5 my-2 h-15">
					<p className="text-sm text-end text-gray-500 capitalize">
						Created At:
					</p>
					<p className="text-sm text-start text-gray-500 capitalize">
						{project.createdAt}
					</p>
					<p className="text-sm text-end text-gray-500 capitalize">
						Updated At:
					</p>
					<p className="text-sm text-start text-gray-500 capitalize">
						{project.updatedAt}
					</p>
				</div>
			</div>
			{/* Display Project Table */}
			<div>
				<DataTable
					columns={columns}
					data={projectsData}
					setProject={setProject}
				/>
			</div>
			<div></div>
		</div>
	);
};

export default ProjectsTable;
