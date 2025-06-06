"use client";

import { useSearchParams } from "next/navigation";

import TeamSelector from "@/components/common/team-selector";
import ProjectSelector from "@/components/common/project-selector";

export default function DashboardHeader() {
  const searchParams = useSearchParams();
  const teamIdQuery = searchParams.get("team");
  const projectIdQuery = searchParams.get("project");

  return (
    <div className="flex flex-row gap-4">
      <TeamSelector teamId={parseInt(teamIdQuery)} />
      <ProjectSelector projectId={parseInt(projectIdQuery)} />
    </div>
  );
}
