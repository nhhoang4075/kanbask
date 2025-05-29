"use client";

import AppHeader from "@/components/app/app-header";
import TeamsMain from "@/components/team/teams-main";
import { TeamProvider } from "@/hooks/use-team";
import { ProjectProvider } from "@/hooks/use-project";

export default function TeamPage() {
  return (
    <TeamProvider>
      <ProjectProvider>
        <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
          <AppHeader name="Team" />
          <div className="flex-1 flex flex-col rounded-md overflow-auto">
            <TeamsMain />
          </div>
        </div>
      </ProjectProvider>
    </TeamProvider>
  );
}
