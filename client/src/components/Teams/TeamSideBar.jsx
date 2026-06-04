import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { teams, projectsData } from "@/data/teams";
import { ChevronDown, ChevronRight, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";
import MoreButton from "./MoreButton";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../ui/collapsible";
import { cn } from "@/lib/utils";
import AddTeam from "./MemberView/AddTeam";
import { ProjectDetailSheet } from "./ProjectView/ProjectDetailSheet";
import { TeamDetailSheet } from "./TeamDetailSheet";

const MemberSideBar = ({ props }) => {
  const { teamShow, setTeamShow, showData, setShowData } = props;
  const [teamList, setTeamList] = useState(teams);
  const [activeTeam, setActiveTeam] = useState(teamShow);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isOpenTeamDetails, setIsOpenTeamDetails] = useState(false);
  const [isOpenProjectDetails, setIsOpenProjectDetails] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(teamShow);
  const [selectedProject, setSelectedProject] = useState(teamShow);

  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
    manualJoinApproval: true
  });

  const [expandedTeams, setExpandedTeams] = useState(
    teamList.reduce((a, team) => {
      if (team.id === teamShow?.id) return { ...a, [team.id]: true };
      return { ...a, [team.id]: false };
    }, {})
  );

  const toggleTeam = (teamId) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const searchTeamProject = (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length > 0) {
      const filteredProject = projectsData
        .filter((project) => project.name.toLowerCase().includes(value))
        .map((project) => project.teamId);

      const filteredTeams = teams.filter(
        (team) => team.name.toLowerCase().includes(value) || filteredProject.includes(team.id)
      );

      filteredTeams.sort((a, b) => a.name.localeCompare(b.name));

      setTeamList(filteredTeams);
    } else {
      setTeamList(teams);
    }
  };

  const handleCreateTeam = () => {
    // Generate a unique ID for the new team
    const teamId = `team${Object.keys(teamList).length + 1}_${Date.now()}`;

    // Create the new team object
    const newTeam = {
      id: teamId,
      name: newTeamData.name,
      createdBy: "Current User", // In a real app, this would be the current user
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      description: newTeamData.description,
      members: [
        // In a real app, the current user would be added as the first member
        {
          id: "current_user",
          name: "Current User",
          email: "current.user@example.com",
          role: "Team Lead",
          status: "Active"
        }
      ],
      queue: [],
      projects: [],
      settings: {
        manualJoinApproval: newTeamData.manualJoinApproval
      }
    };

    // Update teams data
    const updatedTeamsData = [...teamList, newTeam];

    // Update state
    setTeamList(updatedTeamsData);

    // Expand the new team in the sidebar
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: true
    }));

    // Select the new team
    setTeamShow(() => newTeam);
    setShowData("members");

    // Reset form
    setNewTeamData({
      name: "",
      description: "",
      manualJoinApproval: true
    });

    // Close the sheet
    setIsCreateTeamOpen(false);
  };

  return (
    <div className="w-full col-span-2 border-r bg-white">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-xl font-bold">Teams and Projects</h2>
        <AddTeam
          newTeamData={newTeamData}
          setNewTeamData={setNewTeamData}
          setIsCreateTeamOpen={setIsCreateTeamOpen}
          isCreateTeamOpen={isCreateTeamOpen}
          handleCreateTeam={handleCreateTeam}
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
      <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-10rem)]">
        {teamList.map((team) => (
          <Collapsible key={team.id} open={expandedTeams[team.id]}>
            <div className="flex flex-row justify-between items-center pr-0.5">
              <CollapsibleTrigger className="w-full">
                <div
                  className={cn(
                    "flex w-full  items-center gap-2 px-1.5 py-1.5 hover:bg-gray-200",
                    activeTeam?.id === team.id && "bg-gray-100 text-blue-700"
                  )}
                  onClick={() => {
                    setTeamShow(team);
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
                  <span className="font-medium flex flex-row items-center gap-2">{team.name}</span>
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
                    <div key={project.id} className="grid grid-cols-7 justify-between">
                      <div
                        onClick={() => {
                          setTeamShow(project);
                          setActiveTeam(team);
                          setShowData("project");
                        }}
                        key={project.id}
                        className="col-span-6 text-base pl-7 w-full text-left overflow-hidden text-ellipsis hover:cursor-pointer hover:bg-gray-100"
                      >
                        {project.name}
                      </div>
                      <MoreButton
                        object={project}
                        setSelected={setSelectedProject}
                        setOpenDetails={setIsOpenProjectDetails}
                      />
                    </div>
                  );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <TeamDetailSheet
        isOpen={isOpenTeamDetails}
        onOpenChange={setIsOpenTeamDetails}
        team={selectedTeam}
        edit={false}
      />
      <ProjectDetailSheet
        isOpen={isOpenProjectDetails}
        onOpenChange={setIsOpenProjectDetails}
        project={selectedProject}
        edit={false}
      />
    </div>
  );
};

export default MemberSideBar;
