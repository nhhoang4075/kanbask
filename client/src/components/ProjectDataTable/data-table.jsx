"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
	ColumnFiltersState,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import DeleteAlert from "../DeleteAlert";
import EditProject from "./EditProject";
import AddProject from "./AddProject";

export function DataTable({ columns, data, setProject }) {
	const [rowSelection, setRowSelection] = useState({});
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
	});

	return (
		<div className="rounded-md text-center">
			<div className="flex flex-row justify-end gap-3 my-2">
				{table.getSelectedRowModel()?.rows.length == 1 && (
					<EditProject
						project={table.getSelectedRowModel().rows[0]}
					/>
				)}
				{table.getSelectedRowModel().rows.length > 0 && (
					<>
						<DeleteAlert />
					</>
				)}
				<AddProject />
			</div>
			<Table className="rounded-md border-2 text-center border-neutral-400">
				<TableHeader className="bg-neutral-200">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										className="text-center"
										key={header.id}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								onClick={() => {
									// row.toggleSelected();
									setProject(row.original);
								}}
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
