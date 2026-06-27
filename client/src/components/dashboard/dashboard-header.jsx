"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardHeader() {
  const { teams, selectedTeamId, setSelectedTeamId } = useDashboard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamIdQuery = searchParams.get("team");

  const handleSelectTeam = (value) => {
    setSelectedTeamId(value);
    router.push(`/app?team=${value}`);
  };

  useEffect(() => {
    if (!teams.length) return;

    if (teamIdQuery) {
      const existingTeam = teams.find((team) => team.id === parseInt(teamIdQuery));

      if (existingTeam) {
        setSelectedTeamId(parseInt(teamIdQuery));
      } else {
        router.push("/app");
      }
    }
  }, [teamIdQuery, teams]);

  return (
    <Select onValueChange={handleSelectTeam} value={selectedTeamId}>
      <SelectTrigger className="w-50">
        {teams.length > 0 ? (
          <SelectValue placeholder="Select team" />
        ) : (
          <div className="text-gray-500">No teams found</div>
        )}
      </SelectTrigger>
      {teams.length > 0 && (
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  );
}
