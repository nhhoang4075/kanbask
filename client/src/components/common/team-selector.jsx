"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

export default function TeamSelector({ teamId }) {
  const { teams, selectedTeam, setSelectedTeam } = useTeam();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!teams.length || teamId === selectedTeam?.id) return;

    if (teamId) {
      const existingTeam = teams.find((team) => team.id === teamId);

      if (existingTeam) {
        setSelectedTeam(existingTeam);
      } else {
        const params = new URLSearchParams(searchParams);
        params.delete("team");
        params.delete("project");
        params.delete("detail");

        router.push(`${pathname}?${params.toString()}`);
      }
    }
  }, [teamId, teams]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between bg-white"
        >
          {selectedTeam ? (
            <p className="truncate font-normal">{selectedTeam.name}</p>
          ) : (
            <p className="truncate text-gray-500">Select Team</p>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {teams.map((team) => {
                const params = new URLSearchParams(searchParams);
                params.set("team", team.id);
                params.delete("project");
                params.delete("detail");

                return (
                  <CommandItem key={team.id} value={team.id} onSelect={() => setOpen(false)}>
                    <Link
                      href={`${pathname}?${params.toString()}`}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="truncate">{team.name}</div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam?.id === team.id ? "opacity-100" : "opacity-0"
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
