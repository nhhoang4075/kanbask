import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { teams, projectsData } from "@/data/teams";
import { MoreVertical, Search } from "lucide-react";
import { Input } from "../ui/input";

const MemberSideBar = ({ props }) => {
	const { teamShow, setTeamShow, showData, setShowData } = props;

	return (
		<div className="w-80 bg-neutral-100 px-3 py-2 h-full">
			<h2 className="text-center font-bold text-xl mb-2 py-2">
				Teams and Members
			</h2>
			<Separator />
			<form className="flex justify-around items-center my-1">
				<div>
					<Input
						name="name"
						id="name"
						className="my-1.5 bg-white"
						placeholder="Search Team/Project"
					/>
				</div>
				<button
					type="submit"
					className="search-btn text-white hover:cursor-pointer"
				>
					<Search className="size-5 bg-black rounded-full p-1 w-8 h-8" />
				</button>
			</form>
			<Separator />
			<ScrollArea>
				{teams.map((team) => (
					<>
						<div className="flex justify-between py-2 hover:bg-neutral-200">
							<button
								onClick={(teamShow) => {
									setTeamShow(team);
									setShowData("team");
								}}
								key={team.id}
								className="text-base capitalize px-2 hover:cursor-pointer w-full text-left"
							>
								{team.name}
							</button>
							<MoreVertical />
						</div>
						<Separator />
						{projectsData.map((project) => {
							if (project.teamId == team.id)
								return (
									<>
										<div className="flex justify-between py-1.5 pl-5 hover:bg-neutral-200">
											<button
												onClick={(teamShow) => {
													setTeamShow(project);
													setShowData("project");
												}}
												key={project.id}
												className="text-base text-left capitalize px-2 w-full hover:cursor-pointer"
											>
												{project.name}
											</button>
											<MoreVertical />
										</div>
										<Separator />
									</>
								);
						})}
					</>
				))}
			</ScrollArea>
		</div>
	);
};

export default MemberSideBar;
