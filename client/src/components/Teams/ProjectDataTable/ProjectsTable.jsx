"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./column";
import { projectsData } from "@/data/teams";

const ProjectsTable = ({ props }) => {
	const { project, setProject } = props;

	useEffect(() => {}, []);

	return (
		<div className="w-full h-[calc(100vh-140px)] px-5 overflow-y-auto pt-1.5 pb-3">
			{/* Display Project Properties */}
			<div className="grid grid-cols-6 h-fit max-h-80 my-3 gap-1 overflow-hidden">
				<div className="col-span-5 max-h-80 bg-gray-100 rounded-lg shadow-xs border-2 border-gray-600 py-3 px-6 overflow-hidden">
					<h2 className="font-bold text-3xl capitalize overflow-x-auto mb-2 py-2">
						{project.name}
					</h2>
					<p className="text-base text-start overflow-auto text-gray-500">
						Created By: {project.createdBy}
					</p>
					<p className="text-base">Description:</p>
					<div className="text-base text-black text-ellipsis h-fit max-h-37 overflow-auto">
						{project.description}
					</div>
				</div>
				<div className="grid grid-cols-2 gap-x-2 mb-2 h-15">
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
					setFunction={setProject}
					manage={"project"}
				/>
			</div>
			<div></div>
		</div>
	);
};

export default ProjectsTable;
