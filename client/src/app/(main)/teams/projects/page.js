"use client";

import ProjectsTable from "@/components/ProjectDataTable/ProjectsTable";
import React, { useState } from "react";
import { projectsData } from "@/data/teams";

const Projects = () => {
	const [project, setProject] = useState(projectsData[0]);

	const props = { project, setProject };

	return (
		<div className="flex h-auto max-h-[calc(100vh-150px)] overflow-hidden w-full bg-white">
			<ProjectsTable props={props} />
		</div>
	);
};

export default Projects;
