"use client";

import { useEffect } from "react";

import ProjectMemberTable from "@/components/team/project-manage/project-member-table";
import ProjectInformationCard from "@/components/team/project-manage/project-information-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProject } from "@/hooks/use-project";

export default function ProjectManageWindow({ teamId, projectId }) {
  const { projects, selectedProject, setSelectedProject } = useProject();

  useEffect(() => {
    if (projectId) {
      setSelectedProject(
        Object.values(projects)
          .flat()
          .find((project) => project.id === projectId)
      );
    }
  }, [projectId, projects]);

  return (
    <div className="w-full h-full bg-white">
      {selectedProject ? (
        <>
          <Tabs defaultValue="members" className="w-full h-full bg-white">
            <TabsList className="justify-start w-full px-6 gap-x-4 rounded-none border-b bg-white">
              <TabsTrigger
                value="members"
                className="flex-none p-0 text-sm text-gray-500 rounded-none shadow-none data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
              >
                Members
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="w-full h-[calc(98vh-100px)]">
              <TabsContent value="members" className="m-0">
                <div className="w-full p-6 overflow-y-auto space-y-4">
                  <ProjectInformationCard />
                  <ProjectMemberTable />
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </>
      ) : (
        <div className="flex flex-col justify-center h-full bg-white">
          <p className="text-lg text-center text-muted-foreground">
            Join or create a project to continue
          </p>
        </div>
      )}
    </div>
  );
}
