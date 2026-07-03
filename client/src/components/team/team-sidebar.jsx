"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ChevronDown, ChevronRight, Search, EllipsisVertical, Plus, Hash } from "lucide-react";

import CreateTeamSheet from "@/components/team/actions/create-team-sheet";
import JoinTeamSheet from "@/components/team/actions/join-team-sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";
import { cn } from "@/lib/utils";

export default function TeamSideBar() {
  const { teams, selectedTeam, setSelectedTeam } = useTeam();
  const { projects, fetchProjects } = useProject();
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const { id: teamIdParam } = useParams();
  const searchParams = useSearchParams();
  const projectIdQuery = searchParams.get("project");

  useEffect(() => {
    setFilteredTeams(teams);
  }, [teams]);

  const [expandedTeams, setExpandedTeams] = useState(
    teams.reduce((a, team) => {
      if (team.id === selectedTeam?.id) {
        return { ...a, [team.id]: true };
      }
      return { ...a, [team.id]: false };
    }, {})
  );

  useEffect(() => {
    setExpandedTeams((prev) => ({
      ...prev,
      [parseInt(teamIdParam)]: true
    }));
  }, [teamIdParam]);

  const toggleTeamExpanded = async (teamId) => {
    if (!(teamId in projects)) {
      await fetchProjects(teamId);
    }

    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const onSearch = useDebouncedCallback(async (e) => {
    const term = e.target.value.trim().toLowerCase();

    if (term.length > 0) {
      await Promise.all(
        teams.map((team) => {
          if (!(team.id in projects)) {
            fetchProjects(team.id);
          }
        })
      );

      const filteredProject = Object.values(projects)
        .flat()
        .filter((project) => project.name.toLowerCase().includes(term))
        .map((project) => project.team_id);

      const filtered = teams.filter(
        (team) => team.name.toLowerCase().includes(term) || filteredProject.includes(team.id)
      );

      filtered.sort((a, b) => a.name.localeCompare(b.name));

      setFilteredTeams(filtered);
      setExpandedTeams((prev) => ({
        ...prev,
        ...filtered.map((team) => ({ [team.id]: true }))
      }));
    } else {
      setFilteredTeams(teams);
    }
  }, 500);

  return (
    <div className="w-full h-full bg-white overflow-hidden py-4">
      <div className="flex items-center justify-between gap-2 px-6 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            onChange={onSearch}
            placeholder="Search team, project"
            className="pl-8 focus-visible:ring-0"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onSelect={() => setIsCreateTeamOpen(true)}>
              <Plus className="h-4 w-4" />
              Create team
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsJoinTeamOpen(true)}>
              <Hash className="h-4 w-4" />
              Join team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-[calc(100vh-140px)] px-2">
        {filteredTeams.map((team) => (
          <Collapsible key={team.id} open={expandedTeams[team.id] || false}>
            <div
              className={cn(
                "flex flex-row justify-between items-center my-2 hover:bg-blue-green/10 rounded-md transition-colors duration-200 ease-in-out",
                !projectIdQuery &&
                  (parseInt(teamIdParam) === team.id || selectedTeam?.id === team.id) &&
                  "bg-blue-green/10 text-blue-green"
              )}
            >
              <CollapsibleTrigger className="w-full">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 w-full px-4 py-2">
                  <Link href={`/app/team/${team.id}`}>
                    <p className="text-left font-semibold truncate">{team.name}</p>
                  </Link>
                  <div
                    onClick={async () => await toggleTeamExpanded(team.id)}
                    className="cursor-pointer"
                  >
                    {expandedTeams[team.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <ul className="space-y-1">
                {projects[team.id]?.map((project) => {
                  return (
                    <li key={project.id}>
                      <Link
                        href={`/app/team/${team.id}?project=${project.id}`}
                        onClick={() => setSelectedTeam(team)}
                      >
                        <div
                          className={cn(
                            "grid grid-cols-[minmax(0,1fr)] items-center w-full rounded-md hover:bg-blue-green/10 transition-colors duration-200 ease-in-out",
                            parseInt(projectIdQuery) === project.id &&
                              "bg-blue-green/10 text-blue-green"
                          )}
                        >
                          <p
                            key={project.id}
                            className="pl-12 pr-6 py-2 w-full rounded-md text-left text-sm truncate"
                          >
                            {project.name}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </ScrollArea>
      <CreateTeamSheet open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen} />
      <JoinTeamSheet open={isJoinTeamOpen} onOpenChange={setIsJoinTeamOpen} />
    </div>
  );
}
