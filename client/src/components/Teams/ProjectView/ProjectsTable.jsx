"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { ProjectDataTable } from "./ProjectDataTable";
import MoreButton from "../teams-ui/MoreButton";
import { useTeamContext } from "@/hooks/use-teams";

const ProjectsTable = ({ view }) => {
  const {
    selectedTeam,
    selectedProject,
    setSelectedProject,
    isOpenTeamDetails,
    isOpenProjectDetails,
    showData,
    projectsData,
    setIsOpenProjectDetails,
    setIsOpenTeamDetails
  } = useTeamContext();

  const [teamShow, setTeamShow] = useState(selectedTeam);

  useEffect(() => {
    setTeamShow(() => {
      if (showData == "team") {
        return selectedTeam;
      } else if (showData == "project") {
        return selectedProject;
      }
    });
  });

  const [filterProjectsData, setFilterProjectsData] = useState(() => {
    if (view === "all") return projectsData;
    return projectsData.filter((project) => {
      if (showData == "team") return project.teamId == teamShow.id;
    });
  });

  useEffect(() => {
    setFilterProjectsData(() => {
      if (view === "all") return projectsData;
      return projectsData.filter((project) => {
        if (showData == "team") return project.teamId == teamShow.id;
      });
    });
  }, [teamShow, view, showData]);

  return (
    <div className="w-full px-3 overflow-y-auto col-span-7 space-y-4 h-[calc(100vh-7rem)]">
      {/* Display Project Properties */}
      {view == "all" ? (
        <div className="py-2 px-1 h-fit max-h-80 gap-1 overflow-auto">
          <h2 className="mb-2 w-full font-bold text-3xl capitalize">All Projects</h2>
          {selectedProject ? (
            <Card className="my-2 border-2 py-4 h-fit max-h-80 gap-1 overflow-auto">
              <CardHeader>
                <div className="grid grid-cols-[1fr_auto] items-start">
                  <div>
                    <CardTitle className="w-full font-bold text-3xl capitalize mb-2">
                      {selectedProject.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Created By: {selectedProject.createdBy}
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Created At: {selectedProject.createdAt}</div>
                    <div>Updated At: {selectedProject.updatedAt}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="font-medium">Description:</h3>
                  <p className="text-sm text-muted-foreground text-ellipsis h-fit max-h-37 overflow-auto">
                    {selectedProject.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="p-2 text-gray-500 bg-white rounded-lg shadow-sm">
              Select a project to view
            </p>
          )}
        </div>
      ) : (
        <>
          <Card className="w-full my-2 border-2 py-4 h-fit max-h-80 gap-1 overflow-auto">
            <CardHeader>
              <div className="grid grid-cols-[1fr_auto] items-start">
                <div>
                  <CardTitle className="w-full font-bold text-3xl capitalize mb-2">
                    {teamShow.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Created By: {teamShow.createdBy}
                  </CardDescription>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Created At: {teamShow.createdAt}</div>
                    <div>Updated At: {teamShow.updatedAt}</div>
                  </div>
                  {showData == "team" ? (
                    <MoreButton
                      object={teamShow}
                      setOpenDetails={setIsOpenTeamDetails}
                      setSelected={null}
                    />
                  ) : (
                    <MoreButton
                      object={teamShow}
                      setOpenDetails={setIsOpenProjectDetails}
                      setSelected={setSelectedProject}
                    />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-medium">Description:</h3>
                <p className="text-sm text-muted-foreground text-ellipsis h-fit max-h-37 overflow-auto">
                  {teamShow?.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {/* Display Project Table */}
      {(showData == "team" || view == "all") && (
        <div>
          <ProjectDataTable
            data={filterProjectsData}
            manage={"project"}
            view={view}
            setSelectedProject={setSelectedProject}
            setIsOpenProjectDetails={setIsOpenProjectDetails}
            selectedProject
          />
        </div>
      )}
      <div></div>
    </div>
  );
};

export default ProjectsTable;
