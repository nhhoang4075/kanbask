"use client";
import { Calendar, Clock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import React from "react";

const KanbanTask = ({ task, columnId }) => {
	const handleDragStart = (e) => {
		e.dataTransfer.setData("taskId", task.id);
		e.dataTransfer.setData("columnId", columnId);
		e.dataTransfer.effectAllowed = "move";
	};

	const priorityColors = {
		low: "bg-green-100 text-green-800 hover:bg-green-100/80",
		medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
		high: "bg-red-100 text-red-800 hover:bg-red-100/80",
	};

	const dueDate = formatDate(task.dueDate);
	const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

	return (
		<Card
			className="cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-shadow"
			draggable
			onDragStart={handleDragStart}
		>
			<CardHeader className="p-3 pb-0">
				<div className="flex justify-between items-start gap-2">
					<h4 className="text-sm font-medium">{task.title}</h4>
					<Badge
						variant="outline"
						className={cn(
							"text-xs font-normal",
							priorityColors[task.priority]
						)}
					>
						{task.priority}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-3 text-xs text-muted-foreground">
				{task.description}
			</CardContent>
			<CardFooter className="p-3 pt-0 flex justify-between items-center">
				{task.assignee ? (
					<Avatar className="h-6 w-6">
						<AvatarImage
							src={task.assignee.avatar || "/placeholder.svg"}
							alt={task.assignee.name}
						/>
						<AvatarFallback className="text-xs">
							{task.assignee.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
				) : (
					<span className="h-6 w-6" />
				)}

				{dueDate && (
					<div
						className={cn(
							"flex items-center gap-1 text-xs",
							isOverdue ? "text-red-500" : "text-muted-foreground"
						)}
					>
						{isOverdue ? (
							<Clock className="h-3 w-3" />
						) : (
							<Calendar className="h-3 w-3" />
						)}
						{dueDate}
					</div>
				)}
			</CardFooter>
		</Card>
	);
};

export default KanbanTask;
