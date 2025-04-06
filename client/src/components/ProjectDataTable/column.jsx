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
		cell: ({ row }) => {
			const project = row.original;
			return (
				<div className="w-full text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px] text-center">
					{project.description}
				</div>
			);
		},
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

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(project.id)
							}
						>
							Copy project ID
						</DropdownMenuItem>
						<EditProject project={row} />
						<DropdownMenuSeparator />
						<DeleteAlert />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
