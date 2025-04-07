import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const EditProject = ({ project }) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-33">
					Edit
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						Edit project information: {project.id}
					</DialogTitle>
					<DialogDescription>
						Make changes to your project here. Click save when
						you're done.
					</DialogDescription>
				</DialogHeader>
				<form>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Project Name
							</Label>
							<Input
								id="name"
								defaultValue={project.name}
								className="col-span-3"
								type="text"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="description" className="text-right">
								Description
							</Label>
							<Textarea
								id="description"
								defaultValue={project.description}
								className="col-span-3"
								type="email"
								required
							/>
						</div>
					</div>
					<DialogFooter className="flex justify-between">
						<Button
							type="reset"
							className="bg-white text-black border-gray-600 border-2 hover:bg-gray-300 hover:cursor-pointer"
						>
							Reset
						</Button>
						<Button
							className="bg-blue-600  hover:bg-blue-800 hover:cursor-pointer"
							type="submit"
						>
							Save changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditProject;
