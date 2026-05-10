import KanbanBoard from "@/components/Tasks/KanbanBoard";
import React from "react";

const page = () => {
	return (
		<main className="container mx-auto p-4 md:p-6">
			<h1 className="mb-6 text-3xl font-bold">Project Tasks</h1>
			<KanbanBoard />
		</main>
	);
};

export default page;
