import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDashboard } from "@/hooks/use-dashboard";
import { useEffect } from "react";

export default function DashboardHeader() {
  const { teams, chosenTeamId, setChosenTeamId } = useDashboard();
  // Set the initial chosen team ID to the first team in the list
  const handleTeamChange = (value) => {
    setChosenTeamId(value);
  };
  return (
    <div className="flex items-center space-x-4 mb-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <Select onValueChange={handleTeamChange} value={chosenTeamId}>
        <SelectTrigger className="w-[180px]">
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