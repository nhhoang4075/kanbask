import React, { useState } from "react";
import { Separator } from "../../ui/separator";
import { teams, projectsData } from "@/data/teams";
import { ChevronDown, ChevronRight, Plus, Search } from "lucide-react";
import { Input } from "../../ui/input";
import ProjectMoreButton from "../ProjectDataTable/ProjectMoreButton";
import { Button } from "../../ui/button";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "../../ui/collapsible";
import { cn } from "@/lib/utils";

const MemberSideBar = ({ props }) => {
	const { teamShow, setTeamShow, showData, setShowData } = props;

	const [activeTeam, setActiveTeam] = useState(teamShow);
	const [teamList, setTeamList] = useState(teams);
	const [expandedTeams, setExpandedTeams] = useState(
		teamList.reduce((a, team) => {
			return { ...a, [team.id]: true };
		}, {})
	);

	const toggleTeam = (teamId) => {
		setExpandedTeams((prev) => ({
			...prev,
			[teamId]: !prev[teamId],
		}));
	};

	const searchTeamProject = (e) => {
		const value = e.target.value.toLowerCase();
		if (value.length > 0) {
			const filteredProject = projectsData
				.filter((project) => project.name.toLowerCase().includes(value))
				.map((project) => project.teamId);

			const filteredTeams = teams.filter(
				(team) =>
					team.name.toLowerCase().includes(value) ||
					filteredProject.includes(team.id)
			);

			filteredTeams.sort((a, b) => a.name.localeCompare(b.name));

			setTeamList(filteredTeams);
		} else {
			setTeamList(teams);
		}
	};

	return (
		<div className="w-full col-span-2 flex-shrink-0 border-r bg-white">
			<div className="flex items-center justify-between border-b px-4 py-2">
				<h2 className="text-base font-medium">Teams and Projects</h2>
				<Button variant="ghost" size="icon" className="h-6 w-6">
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			<div className="p-2 border-b-2">
				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input
						onChange={(e) => searchTeamProject(e)}
						placeholder="Search team/project"
						className="pl-8"
					/>
				</div>
			</div>
			<div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-13rem)]">
				{teamList.map((team) => (
					<Collapsible key={team.id} open={expandedTeams[team.id]}>
						<div className="flex flex-row justify-between items-center pr-0.5">
							<CollapsibleTrigger className="w-full">
								<div
									className={cn(
										"flex w-full cursor-pointer items-center justify-between px-1.5 py-1.5 hover:bg-gray-200",
										activeTeam?.id === team.id &&
											"bg-gray-100 text-blue-700"
									)}
									onClick={(teamShow) => {
										setTeamShow(team);
										setShowData("team");
										setActiveTeam(team);
										toggleTeam(team.id);
									}}
								>
									<span className="font-medium flex flex-row items-center gap-2">
										{expandedTeams[team.id] ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
										{team.name}
									</span>
								</div>
							</CollapsibleTrigger>
							<ProjectMoreButton project={team} />
						</div>

						<CollapsibleContent className="border-b-2">
							{projectsData.map((project) => {
								if (project.teamId == team.id)
									return (
										<div
											key={project.id}
											className="grid grid-cols-7 justify-between"
										>
											<div
												onClick={() => {
													setTeamShow(project);
													setShowData("project");
												}}
												key={project.id}
												className="col-span-6 text-base pl-4 w-full text-left overflow-hidden text-ellipsis hover:cursor-pointer hover:bg-gray-100"
											>
												{project.name}
											</div>
											<ProjectMoreButton
												project={project}
											/>
										</div>
									);
							})}
						</CollapsibleContent>
					</Collapsible>
				))}
			</div>
		</div>
	);
};

export default MemberSideBar;
