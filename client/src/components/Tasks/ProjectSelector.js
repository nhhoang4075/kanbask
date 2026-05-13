"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
	CommandList,
	CommandGroup,
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
} from "../ui/command";

const ProjectSelector = ({ projects, selectedProject, onProjectChange }) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="min-w-[200px] justify-between"
				>
					<div className="flex items-center gap-2">
						{selectedProject?.name || "Select project..."}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<Command>
					<CommandInput placeholder="Search project..." />
					<CommandList>
						<CommandEmpty>No project found.</CommandEmpty>
						<CommandGroup>
							{projects.map((project) => (
								<CommandItem
									key={project.id}
									value={project.name}
									onSelect={() => {
										onProjectChange(project);
										setOpen(false);
									}}
								>
									<div className="flex items-center gap-2">
										{project.name}
									</div>
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											selectedProject.id === project.id
												? "opacity-100"
												: "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ProjectSelector;
