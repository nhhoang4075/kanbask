import React from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";

const AddMember = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="bg-blue-600  hover:bg-blue-800 hover:cursor-pointer text-white hover:text-white"
				>
					Add Member
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add new member to team</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when
						you're done.
					</DialogDescription>
				</DialogHeader>
				<form>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								placeholder="Enter member name"
								className="col-span-3"
								type="text"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								placeholder="Enter member email"
								className="col-span-3"
								type="email"
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="role" className="text-right">
								Role
							</Label>
							<Select
								id="role"
								className="col-span-3"
								placeholder="Select a role"
								defaultValue="member"
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Role</SelectLabel>
										<SelectItem value="owner">
											Owner
										</SelectItem>
										<SelectItem value="admin">
											Admin
										</SelectItem>
										<SelectItem value="member">
											Member
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
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

export default AddMember;
