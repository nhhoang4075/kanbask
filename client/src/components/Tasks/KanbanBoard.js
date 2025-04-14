"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { KanbanColumn } from "./KanbanColumn";
import NewTasks from "./NewTasks";
import { initialData } from "@/data/tasks";

const KanbanBoard = () => {
	const [columns, setColumns] = useState(initialData);
	const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

	const handleTaskMove = (taskId, sourceColumnId, destinationColumnId) => {
		setColumns((prevColumns) => {
			// Find the task in the source column
			const sourceColumn = prevColumns.find(
				(col) => col.id === sourceColumnId
			);
			if (!sourceColumn) return prevColumns;

			const taskIndex = sourceColumn.tasks.findIndex(
				(task) => task.id === taskId
			);
			if (taskIndex === -1) return prevColumns;

			const task = sourceColumn.tasks[taskIndex];

			// Create new columns array with the task moved
			return prevColumns.map((column) => {
				// Remove from source column
				if (column.id === sourceColumnId) {
					return {
						...column,
						tasks: column.tasks.filter((t) => t.id !== taskId),
					};
				}

				// Add to destination column
				if (column.id === destinationColumnId) {
					return {
						...column,
						tasks: [...column.tasks, task],
					};
				}

				return column;
			});
		});
	};

	const handleAddTask = (task, columnId) => {
		setColumns((prevColumns) =>
			prevColumns.map((column) =>
				column.id === columnId
					? { ...column, tasks: [...column.tasks, task] }
					: column
			)
		);
		setIsNewTaskDialogOpen(false);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<div className="text-sm text-muted-foreground">
					{columns.reduce(
						(acc, column) => acc + column.tasks.length,
						0
					)}{" "}
					tasks
				</div>
				<Button onClick={() => setIsNewTaskDialogOpen(true)} size="sm">
					<Plus className="h-4 w-4 mr-1" />
					Add Task
				</Button>
			</div>

			<NewTasks
				open={isNewTaskDialogOpen}
				onOpenChange={setIsNewTaskDialogOpen}
				onAddTask={(task) => handleAddTask(task, "todo")}
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
				{columns.map((column) => (
					<KanbanColumn
						key={column.id}
						column={column}
						onTaskMove={handleTaskMove}
					/>
				))}
			</div>
		</div>
	);
};

export default KanbanBoard;
