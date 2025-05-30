"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import TeamManageWindow from "@/components/team/team-manage/team-manage-window";
import ProjectManageWindow from "@/components/team/project-manage/project-manage-window";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";

export default function TeamWindow({ teamId }) {
  const { teams, setSelectedTeam } = useTeam();
  const { projects, fetchProjects } = useProject();
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("project");

  useEffect(() => {
    if (!teams.length) return;

    if (teamId) {
      const existingTeam = teams.find((team) => team.id === teamId);

      if (existingTeam) {
        setSelectedTeam(existingTeam);
      } else {
        router.push("/app/team");
      }
    }

    if (!(teamId in projects)) {
      fetchProjects(teamId);
    }
  }, [teamId, teams]);

  if (projectId) {
    return <ProjectManageWindow teamId={teamId} projectId={parseInt(projectId)} />;
  }

  return <TeamManageWindow teamId={teamId} />;
}
