"use client";

import KanbanBoard from "@/components/Tasks/KanbanBoard";
import { ListView } from "@/components/Tasks/List";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { LayoutGrid, List } from "lucide-react";
import React, { useState } from "react";

const page = () => {
	// 2 view modes: kanban and list
	const [viewMode, setViewMode] = useState("kanban");

	return (
		// <main className="w-full mx-auto p-4 md:p-6 overflow-hidden">

		// 	<div className="flex flex-col gap-4 overflow-y-scroll max-h-[550px]">
		// 		<h1 className="mb-6 text-3xl font-bold">Project Tasks</h1>
		// 		<KanbanBoard />
		// 	</div>
		// </main>
		<main className="w-full mx-auto px-4 py-2 overflow-hidden">
			<div className="mb-1 flex flex-col gap-4">
				<h1 className="text-3xl font-bold">Project Tasks</h1>
				<ToggleGroup
					type="single"
					value={viewMode}
					onValueChange={(value) => value && setViewMode(value)}
				>
					<ToggleGroupItem value="kanban" aria-label="Kanban view">
						<LayoutGrid className="h-4 w-4 mr-2" />
						Kanban
					</ToggleGroupItem>
					<ToggleGroupItem value="list" aria-label="List view">
						<List className="h-4 w-4 mr-2" />
						List
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div className="flex flex-col gap-4 overflow-y-scroll max-h-[500px]">
				{viewMode === "kanban" ? <KanbanBoard /> : <ListView />}
			</div>
		</main>
	);
};

export default page;
