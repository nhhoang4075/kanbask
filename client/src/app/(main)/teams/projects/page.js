import ProjectsTable from "@/components/ProjectDataTable/ProjectsTable";
import React from "react";

const Projects = () => {
	return (
		<div className="flex h-full">
			<ProjectsTable props={props} />
		</div>
	);
};

export default Projects;
