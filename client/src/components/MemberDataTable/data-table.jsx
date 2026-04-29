"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function DataTable({ columns, data }) {
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
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
	});

	useEffect(() => {
		table.resetRowSelection();
	}, [table.getRowModel().rows]);

	return (
		<div>
			<div className="flex flex-row justify-end gap-3 my-2">
				{table.getSelectedRowModel()?.rows.length == 1 && (
					<Button
						className="bg-white text-red-500 border-2 border-red-500 w-18 hover:bg-red-600 hover:cursor-pointer hover:text-white"
						onClick={() => {}}
					>
						Edit
					</Button>
				)}
				{table.getSelectedRowModel().rows.length > 0 && (
					<>
						<Button
							className="bg-red-500 w-18 hover:bg-red-600 hover:cursor-pointer hover:text-white"
							onClick={() => {}}
						>
							Delete
						</Button>
					</>
				)}

				<Button
					className="bg-blue-600  hover:bg-blue-800 hover:cursor-pointer"
					onClick={() => {
						const selectedRows = table.getSelectedRowModel().rows;
						console.log(
							"Selected rows:",
							table.getSelectedRowModel().rows.length
						);
					}}
				>
					Add Member
				</Button>
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
									row.toggleSelected();
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
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
