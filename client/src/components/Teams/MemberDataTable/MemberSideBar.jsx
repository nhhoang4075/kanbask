import React, { useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { Separator } from "../../ui/separator";
import { teams, projectsData } from "@/data/teams";
import { MoreVertical, Search } from "lucide-react";
import { Input } from "../../ui/input";
import ProjectMoreButton from "../ProjectDataTable/ProjectMoreButton";

const MemberSideBar = ({ props }) => {
  const { setTeamShow, setShowData } = props;

  const [teamList, setTeamList] = useState(teams);

  const searchTeamProject = (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length > 0) {
      const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(value));

      const filteredProject = projectsData
        .filter((project) => project.name.toLowerCase().includes(value))
        .map((project) => project.teamId);

      const filteredTeamsWithProjects = teams.filter(
        (team) => filteredProject.includes(team.id) && !filteredTeams.some((t) => t.id == team.id)
      );

      const filteredList = [...filteredTeams, ...filteredTeamsWithProjects];
      filteredList.sort((a, b) => a.name.localeCompare(b.name));

      setTeamList(filteredList);
    } else {
      setTeamList(teams);
    }
  };

  return (
    <div className="w-full col-span-2 bg-gray-100 px-3 py-2 max-h-[calc(100vh-80px)]">
      <h2 className="text-center font-bold text-xl mb-2 py-2">Teams and Members</h2>
      <Separator />
      <form className="flex gap-1 justify-around items-center my-1">
        <div>
          <Input
            name="name"
            id="name"
            className="my-1.5 bg-white"
            placeholder="Search Team/Project"
            onChange={(e) => {
              searchTeamProject(e);
            }}
          />
        </div>
      </form>
      <Separator />
      <ScrollArea className="flex flex-col border-2 max-h-103 border-neutral-300 rounded-lg">
        {teamList.map((team) => (
          <div key={team.id}>
            <div className="grid grid-cols-7 gap-1 py-2 hover:bg-neutral-200 max-w-full">
              <div
                onClick={(teamShow) => {
                  setTeamShow(team);
                  setShowData("team");
                }}
                key={team.id}
                className="col-span-6 font-semibold text-base capitalize px-2 hover:cursor-pointer w-full text-left overflow-hidden text-ellipsis"
              >
                {team.name}
              </div>
              <ProjectMoreButton project={team} />
            </div>
            <Separator />
            {projectsData.map((project) => {
              if (project.teamId == team.id)
                return (
                  <div key={project.id}>
                    <div className="grid grid-cols-7 py-1.5 pl-5 hover:bg-neutral-200 w-auto">
                      <div
                        onClick={(teamShow) => {
                          setTeamShow(project);
                          setShowData("project");
                        }}
                        key={project.id}
                        className="col-span-6 text-base w-full text-left capitalize px-2 hover:cursor-pointer overflow-hidden text-ellipsis"
                      >
                        {project.name}
                      </div>
                      <ProjectMoreButton project={project} />
                    </div>
                    <Separator />
                  </div>
                );
            })}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default MemberSideBar;
