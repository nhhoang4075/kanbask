"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import KanbanTask from "./KanbanTask";

export function KanbanColumn({ column, onTaskMove }) {
	const [isOver, setIsOver] = useState(false);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsOver(true);
	};

	const handleDragLeave = () => {
		setIsOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsOver(false);

		const taskId = e.dataTransfer.getData("taskId");
		const sourceColumnId = e.dataTransfer.getData("columnId");

		if (sourceColumnId !== column.id) {
			onTaskMove(taskId, sourceColumnId, column.id);
		}
	};

	return (
		<div
			className={cn(
				"flex flex-col bg-muted/40 rounded-lg p-3 h-full overflow-hidden",
				isOver && "ring-2 ring-primary/20"
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-medium text-sm">{column.title}</h3>
				<span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
					{column.tasks.length}
				</span>
			</div>

			<div className="flex flex-col gap-2 flex-1 overflow-auto">
				{column.tasks.map((task) => (
					<KanbanTask
						key={task.id}
						task={task}
						columnId={column.id}
					/>
				))}
			</div>
		</div>
	);
}
