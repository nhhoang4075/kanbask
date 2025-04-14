"use client";

import { useState } from "react";
import { Calendar, Clock, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn, formatDate } from "@/lib/utils";
import NewTasks from "./NewTasks";
import { initialData } from "@/data/tasks";

export function ListView() {
	const [columns, setColumns] = useState(initialData);
	const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

	// Flatten all tasks from all columns into a single array
	const allTasks = columns.flatMap((column) =>
		column.tasks.map((task) => ({
			...task,
			status: column.title,
		}))
	);

	const handleAddTask = (task) => {
		setColumns((prevColumns) =>
			prevColumns.map((column) =>
				column.id === "todo"
					? { ...column, tasks: [...column.tasks, task] }
					: column
			)
		);
		setIsNewTaskDialogOpen(false);
	};

	const handleStatusChange = (taskId, newStatus) => {
		// Find the task and its current column
		let sourceColumnId = "";
		let task = null;

		for (const column of columns) {
			const foundTask = column.tasks.find((t) => t.id === taskId);
			if (foundTask) {
				sourceColumnId = column.id;
				task = foundTask;
				break;
			}
		}

		if (!task || !sourceColumnId) return;

		// Find the destination column id based on status name
		const destinationColumn = columns.find(
			(col) => col.title === newStatus
		);
		if (!destinationColumn) return;

		// Update columns state
		setColumns((prevColumns) =>
			prevColumns.map((column) => {
				// Remove from source column
				if (column.id === sourceColumnId) {
					return {
						...column,
						tasks: column.tasks.filter((t) => t.id !== taskId),
					};
				}

				// Add to destination column
				if (column.id === destinationColumn.id) {
					return {
						...column,
						tasks: [...column.tasks, task],
					};
				}

				return column;
			})
		);
	};

	const priorityColors = {
		low: "bg-green-100 text-green-800 hover:bg-green-100/80",
		medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
		high: "bg-red-100 text-red-800 hover:bg-red-100/80",
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between items-center">
				<div className="text-sm text-muted-foreground">
					{allTasks.length} tasks
				</div>
				<Button onClick={() => setIsNewTaskDialogOpen(true)} size="sm">
					<Plus className="h-4 w-4 mr-1" />
					Add Task
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Task</TableHead>
							<TableHead>Priority</TableHead>
							<TableHead>Assignee</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{allTasks.map((task) => {
							const dueDate = formatDate(task.dueDate);
							const isOverdue =
								task.dueDate &&
								new Date(task.dueDate) < new Date();

							return (
								<TableRow key={task.id}>
									<TableCell>
										<div>
											<div className="font-medium">
												{task.title}
											</div>
											<div className="text-sm text-muted-foreground">
												{task.description}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={cn(
												"text-xs font-normal",
												priorityColors[task.priority]
											)}
										>
											{task.priority}
										</Badge>
									</TableCell>
									<TableCell>
										{task.assignee ? (
											<div className="flex items-center gap-2">
												<Avatar className="h-6 w-6">
													<AvatarImage
														src={
															task.assignee
																.avatar ||
															"/placeholder.svg"
														}
														alt={task.assignee.name}
													/>
													<AvatarFallback className="text-xs">
														{task.assignee.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<span className="text-sm">
													{task.assignee.name}
												</span>
											</div>
										) : (
											<span className="text-sm text-muted-foreground">
												Unassigned
											</span>
										)}
									</TableCell>
									<TableCell>
										{dueDate ? (
											<div
												className={cn(
													"flex items-center gap-1 text-xs",
													isOverdue
														? "text-red-500"
														: "text-muted-foreground"
												)}
											>
												{isOverdue ? (
													<Clock className="h-3 w-3" />
												) : (
													<Calendar className="h-3 w-3" />
												)}
												{dueDate}
											</div>
										) : (
											<span className="text-sm text-muted-foreground">
												No date
											</span>
										)}
									</TableCell>
									<TableCell>
										<Select
											value={task.status}
											onValueChange={(value) =>
												handleStatusChange(
													task.id,
													value
												)
											}
										>
											<SelectTrigger className="h-8 w-[130px]">
												<SelectValue placeholder="Status" />
											</SelectTrigger>
											<SelectContent>
												{columns.map((column) => (
													<SelectItem
														key={column.id}
														value={column.title}
													>
														{column.title}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			<NewTasks
				open={isNewTaskDialogOpen}
				onOpenChange={setIsNewTaskDialogOpen}
				onAddTask={handleAddTask}
			/>
		</div>
	);
}
