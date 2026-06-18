import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Input } from "../../ui/input";
import MoreButton from "./MoreButton";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../../ui/collapsible";
import { cn } from "@/lib/utils";
import AddTeam from "./AddTeam";
import { useTeamContext } from "@/hooks/use-teams";
import { ScrollArea } from "@/components/ui/scroll-area";

const MemberSideBar = () => {
  const {
    selectedTeam,
    setSelectedTeam,
    setSelectedProject,
    teamsData,
    projectsData,
    setShowData,
    setIsOpenTeamDetails,
    setIsOpenProjectDetails,
    handleCreateTeam
  } = useTeamContext();

  const [activeTeam, setActiveTeam] = useState(selectedTeam);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState(teamsData);

  const [expandedTeams, setExpandedTeams] = useState(
    teamsData.reduce((a, team) => {
      if (team.id === selectedTeam?.id) return { ...a, [team.id]: true };
      return { ...a, [team.id]: false };
    }, {})
  );

  const toggleTeam = (teamId) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  useEffect(() => {
    setFilteredTeams(() => teamsData);
  }, [teamsData]);

  const searchTeamProject = (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length > 0) {
      const filteredProject = projectsData
        .filter((project) => project.name.toLowerCase().includes(value))
        .map((project) => project.teamId);

      const filteredTeams = teamsData.filter(
        (team) => team.name.toLowerCase().includes(value) || filteredProject.includes(team.id)
      );

      filteredTeams.sort((a, b) => a.name.localeCompare(b.name));

      setFilteredTeams(filteredTeams);
    } else {
      setFilteredTeams(teamsData);
    }
  };

  const onCreateTeam = (newTeamData) => {
    // const newTeam =
    handleCreateTeam(newTeamData);
    // toggleTeam(newTeam.id);
    // setActiveTeam(newTeam);
    // setIsCreateTeamOpen(false);
  };

  return (
    <div className="w-full h-full col-span-2 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-3 border-b py-2.5">
        <h2 className="text-xl font-bold">Teams and Projects</h2>
        <AddTeam
          setIsCreateTeamOpen={setIsCreateTeamOpen}
          isCreateTeamOpen={isCreateTeamOpen}
          onCreateTeam={onCreateTeam}
        />
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
      <ScrollArea className="h-[calc(100vh-10.5rem)]">
        {filteredTeams.map((team) => (
          <Collapsible key={team.id} open={expandedTeams[team.id]}>
            <div
              className={cn(
                "flex flex-row justify-between items-center pl-1 pr-0.5 hover:bg-gray-200",
                activeTeam?.id === team.id && "bg-gray-100 text-blue-700"
              )}
            >
              <CollapsibleTrigger className="w-full">
                <div
                  className={cn("flex w-full  items-center gap-2 px-1.5 py-1.5 ")}
                  onClick={() => {
                    setSelectedTeam(team);
                    setShowData("team");
                    setActiveTeam(team);
                  }}
                >
                  <div onClick={() => toggleTeam(team.id)} className="cursor-pointer">
                    {expandedTeams[team.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  <span className="font-medium text-left flex flex-row items-center gap-2">
                    {team.name}
                  </span>
                </div>
              </CollapsibleTrigger>
              <MoreButton
                object={team}
                setOpenDetails={setIsOpenTeamDetails}
                setSelected={setSelectedTeam}
              />
            </div>

            <CollapsibleContent className="border-b-2">
              {projectsData.map((project) => {
                if (project.teamId == team.id)
                  return (
                    <div
                      key={project.id}
                      className="grid grid-cols-7 pl-1 py-0.5 h-full items-center hover:bg-gray-200"
                    >
                      <div
                        onClick={() => {
                          setSelectedProject(project);
                          setActiveTeam(team);
                          setShowData("project");
                        }}
                        key={project.id}
                        className="col-span-6 text-base pl-7 w-full text-left overflow-hidden text-ellipsis hover:cursor-pointer"
                      >
                        {project.name}
                      </div>
                      <div className="flex h-full justify-center align-center">
                        <MoreButton
                          object={project}
                          setSelected={setSelectedProject}
                          setOpenDetails={setIsOpenProjectDetails}
                        />
                      </div>
                    </div>
                  );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </ScrollArea>
    </div>
  );
};

export default MemberSideBar;
