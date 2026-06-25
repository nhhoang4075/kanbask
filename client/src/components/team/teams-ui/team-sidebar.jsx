import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

import MoreButton from "./more-button";
import AddTeam from "./add-team";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";
import { cn } from "@/lib/utils";

export default function TeamSideBar() {
  const { selectedTeam, setSelectedTeam, teams, handleCreateTeam, handleJoinTeam } = useTeam();
  const { projects, setSelectedProject } = useProject();

  // console.log("selectedTeam", selectedTeam);
  // console.log("projects", projects);

  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [joinCode, setJoinCode] = useState("");

  const [expandedTeams, setExpandedTeams] = useState(
    teams.reduce((a, team) => {
      if (team.id === selectedTeam?.id) return { ...a, [team.id]: true };
      return { ...a, [team.id]: false };
    }, {})
  );

  const toggleTeamExpanded = (teamId) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  useEffect(() => {
    setFilteredTeams(() => teams);
  }, [teams, projects]);

  const searchTeamProject = (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length > 0) {
      const filteredProject = projects
        ? projects
            .filter((project) => project.name.toLowerCase().includes(value))
            .map((project) => project.teamId)
        : [];

      const filtered = teams.filter(
        (team) => team.name.toLowerCase().includes(value) || filteredProject.includes(team.id)
      );

      filtered.sort((a, b) => a.name.localeCompare(b.name));

      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams);
    }
  };

  const joinTeam = () => {
    handleJoinTeam(joinCode);
  };

  const onCreateTeam = (newTeamData) => {
    try {
      handleCreateTeam(newTeamData).then((newTeam) => {
        toggleTeamExpanded(newTeam.id);
        setIsCreateTeamOpen(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onProjectClick = (project) => {
    setSelectedProject(project);
    setSelectedTeam(teams.find((team) => team.id == project.team_id));
  };

  return (
    <div className="w-full h-full col-span-2 bg-white overflow-hidden border-r">
      <div className="flex items-center justify-between px-3 border-b py-2.5">
        <h2 className="text-xl font-bold">Team Collabration</h2>
        <AddTeam
          setIsCreateTeamOpen={setIsCreateTeamOpen}
          isCreateTeamOpen={isCreateTeamOpen}
          onCreateTeam={onCreateTeam}
        />
      </div>
      <div className="p-2 border-b-2 space-y-2">
        <div className="flex flex-row gap-3 w-full">
          <div className="w-full">
            <Input
              placeholder="Join team by code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
          </div>
          <Button
            className=" bg-blue-500 hover:bg-blue-700"
            disabled={!joinCode.trim()}
            onClick={joinTeam}
          >
            Join
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            onChange={(e) => searchTeamProject(e)}
            placeholder="Search team, project"
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-10.5rem)]">
        {!teams.length && (
          <p className="text-base text-center text-muted-foreground my-2">
            Please create or join a team
          </p>
        )}
        {filteredTeams.map((team) => (
          <Collapsible key={team.id} open={expandedTeams[team.id] || false}>
            <div
              className={cn(
                "flex flex-row justify-between items-center pl-1 pr-0.5 hover:bg-gray-200",
                team.id === selectedTeam?.id && "bg-gray-100 text-blue-700"
              )}
            >
              <CollapsibleTrigger className="w-full">
                <div
                  className={cn("flex w-full  items-center gap-2 px-1.5 py-1.5 ")}
                  onClick={() => {
                    setSelectedTeam(team);
                    // setShowData("team");
                  }}
                >
                  <div onClick={() => toggleTeamExpanded(team.id)} className="cursor-pointer">
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
              {/* <MoreButton
                object={team}
                setOpenDetails={setIsOpenTeamDetails}
                setSelected={setSelectedTeam}
                manage={"team"}
                edit={false}
              /> */}
            </div>

            <CollapsibleContent className="border-b-2">
              <ul>
                {projects[team.id]?.map((project) => {
                  return (
                    <li
                      key={project.id}
                      className="grid grid-cols-7 pl-1 py-0.5 h-full items-center hover:bg-gray-200"
                    >
                      <div
                        onClick={() => {
                          onProjectClick(project);
                          // setShowData("project");
                        }}
                        key={project.id}
                        className="col-span-6 text-base pl-7 w-full text-left truncate hover:cursor-pointer"
                      >
                        {project.name}
                      </div>
                      {/* <div className="flex h-full justify-center align-center">
                        <MoreButton
                          object={project}
                          setSelected={setProject}
                          setOpenDetails={setIsOpenProjectDetails}
                          manage={"project"}
                          edit={false}
                        />
                      </div> */}
                    </li>
                  );
                })}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </ScrollArea>
    </div>
  );
}
