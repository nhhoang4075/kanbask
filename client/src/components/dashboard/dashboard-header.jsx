"use client";

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

  return (
    <div className="flex items-center space-x-4 mb-4 px-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <Select onValueChange={setSelectedTeamId} value={selectedTeamId}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
