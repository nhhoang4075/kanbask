"use client";

import ProjectsTable from "@/components/Teams/ProjectDataTable/ProjectsTable";
import React, { useState } from "react";
import { projectsData } from "@/data/teams";

const Projects = () => {
	const [project, setProject] = useState(projectsData[0]);

	const props = { project, setProject };

	return (
		<div className="grid h-auto rounded-b-2xl overflow-hidden w-full bg-slate-100">
			<ProjectsTable props={props} />
		</div>
	);
};

export default Projects;
