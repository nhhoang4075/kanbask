"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { KanbanColumn } from "./KanbanColumn";
import NewTasks from "./NewTasks";

const initialData = [
	{
		id: "todo",
		title: "To Do",
		tasks: [
			{
				id: "task-1",
				title: "Research competitors",
				description: "Analyze top 5 competitors in the market",
				priority: "medium",
				assignee: {
					name: "Alex Johnson",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-15",
			},
			{
				id: "task-2",
				title: "Update documentation",
				description: "Update API documentation with new endpoints",
				priority: "low",
				dueDate: "2023-11-20",
			},
			{
				id: "task-3",
				title: "Design new landing page",
				description: "Create wireframes for the new landing page",
				priority: "high",
				assignee: {
					name: "Sam Taylor",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-10",
			},
		],
	},
	{
		id: "in-progress",
		title: "In Progress",
		tasks: [
			{
				id: "task-4",
				title: "Implement authentication",
				description: "Add OAuth2 authentication to the API",
				priority: "high",
				assignee: {
					name: "Jamie Smith",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-12",
			},
			{
				id: "task-5",
				title: "Fix navigation bug",
				description: "Fix the navigation bug on mobile devices",
				priority: "medium",
				assignee: {
					name: "Alex Johnson",
					avatar: "/placeholder.svg?height=40&width=40",
				},
			},
		],
	},
	{
		id: "review",
		title: "Review",
		tasks: [
			{
				id: "task-6",
				title: "Code review: Payment API",
				description: "Review the new payment processing API",
				priority: "high",
				assignee: {
					name: "Taylor Wong",
					avatar: "/placeholder.svg?height=40&width=40",
				},
				dueDate: "2023-11-08",
			},
		],
	},
	{
		id: "done",
		title: "Done",
		tasks: [
			{
				id: "task-7",
				title: "Setup CI/CD pipeline",
				description: "Configure GitHub Actions for automated testing",
				priority: "medium",
				assignee: {
					name: "Jamie Smith",
					avatar: "/placeholder.svg?height=40&width=40",
				},
			},
			{
				id: "task-8",
				title: "Create component library",
				description: "Build reusable UI components",
				priority: "low",
				assignee: {
					name: "Sam Taylor",
					avatar: "/placeholder.svg?height=40&width=40",
				},
			},
		],
	},
];

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
		<div className="flex flex-col gap-4 overflow-auto max-h-[550px]">
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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-auto pb-4">
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
