"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";
import { cn } from "@/lib/utils";

export default function ProjectSelector({ projectId }) {
  const [open, setOpen] = useState(false);
  const { teams, selectedTeam } = useTeam();
  const { projects, selectedProject, setSelectedProject, fetchProjects } = useProject();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!teams.length || !selectedTeam) return;

    if (!(selectedTeam.id in projects)) {
      fetchProjects(selectedTeam.id);
    }
  }, [selectedTeam, teams]);

  useEffect(() => {
    if (!selectedProject || selectedProject.team_id !== selectedTeam?.id) {
      setSelectedProject(projects[selectedTeam?.id]?.[0]);
    }
  }, [selectedProject, projects, selectedTeam]);

  useEffect(() => {
    if (!projects[selectedTeam?.id] || projectId === selectedProject?.id) return;

    if (projectId) {
      const existingProject = projects[selectedTeam?.id]?.find(
        (project) => project.id === projectId
      );

      if (existingProject) {
        setSelectedProject(existingProject);
      } else {
        const params = new URLSearchParams(searchParams);
        params.delete("project");

        router.push(`${pathname}?${params.toString()}`);
      }
    }
  }, [projectId, projects, selectedTeam]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between bg-white"
        >
          {selectedProject ? (
            <p className="truncate font-normal">{selectedProject.name}</p>
          ) : (
            <p className="truncate text-gray-500">Select Project</p>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="Search project..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup>
              {projects[selectedTeam?.id]?.map((project) => {
                const params = new URLSearchParams(searchParams);
                params.set("project", project.id);

                return (
                  <CommandItem key={project.id} value={project.id} onSelect={() => setOpen(false)}>
                    <Link
                      href={`${pathname}?${params.toString()}`}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="truncate">{project.name}</div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedProject?.id === project.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </Link>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
