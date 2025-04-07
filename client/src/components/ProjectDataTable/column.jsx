"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import DeleteAlert from "../DeleteAlert";
import EditProject from "./EditProject";
import ProjectMoreButton from "./ProjectMoreButton";

export const columns = [
	{
		header: "Select",
		cell: ({ row }) => (
			<Checkbox
				className="border-neutral-400"
				checked={row.getIsSelected()}
				onCheckedChange={(value) => {
					row.toggleSelected(!!value);
				}}
				aria-label="Select row"
				id={row.id}
				name={row.id}
			/>
		),
		id: "select",
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Name
					<ArrowUpDown className="ml-1 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "teams",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Team
					<ArrowUpDown className="ml-1 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Created At
					<ArrowUpDown className="ml-1 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Updated At
					<ArrowUpDown className="ml-1 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		header: "Actions",
		id: "actions",
		cell: ({ row }) => {
			const project = row.original;

			return <ProjectMoreButton project={project} />;
		},
	},
];
