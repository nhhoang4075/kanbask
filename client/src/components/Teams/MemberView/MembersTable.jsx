"use client";

import React, { useEffect, useState } from "react";
import { projectMember, projectsData, teams, teamsMember, users } from "@/data/teams.js";
import { columns } from "./column";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { TeamDetailSheet } from "../TeamDetailSheet";
import MemberDataTable from "./MemberDataTable";
import { MoreVertical } from "lucide-react";
import MoreButton from "../MoreButton";
import { ProjectDetailSheet } from "../ProjectView/ProjectDetailSheet";

const MembersTable = ({ props }) => {
  const { teamShow, setTeamShow, showData } = props;
  const [teamList, setTeamList] = useState(teams);
  const [projectList, setProjectList] = useState(projectsData);
  const [teamMembers, setTeamMembers] = useState(teamsMember);
  const [projectMembers, setProjectMembers] = useState(projectMember);
  const [isOpenTeamDetails, setIsOpenTeamDetails] = useState(false);
  const [isOpenProjectDetails, setIsOpenProjectDetails] = useState(false);

  const [usersInTeam, setUsersInTeam] = useState(
    users.filter((user) => {
      if (showData == "team")
        return teamMembers.some((team) => team.userId == user.id && team.teamId == teamShow.id);
      else if (showData == "project")
        return projectMembers.some(
          (project) => project.userId == user.id && project.projectId == teamShow.id
        );
    })
  );

  useEffect(() => {
    setUsersInTeam(
      users.filter((user) => {
        if (showData == "team")
          return teamMembers.some((team) => team.userId == user.id && team.teamId == teamShow.id);
        else if (showData == "project")
          return projectMembers.some(
            (project) => project.userId == user.id && project.projectId == teamShow.id
          );
      })
    );
  }, [teamShow, projectMembers, teamMembers]);

  // Function to update team data
  const updateTeamData = (teamId, updatedTeam) => {
    setTeamList((prev) => {
      let newTeamsData = prev.map((team) => {
        if (team.id === teamId) {
          return updatedTeam;
        } else return team;
      });
      return newTeamsData;
    });
    setTeamShow(() => updatedTeam);
  };

  // Function to update project data
  const updateProjectData = (projectId, updatedProject) => {
    setProjectList((prev) => {
      const projectIndex = prev.findIndex((project) => (project.id = projectId));
      let newProjectsData = prev
        .slice(0, projectIndex)
        .concat(updatedProject)
        .concat(prev.slice(teamIndex + 1));
      return newProjectsData;
    });
    setTeamShow(() => updatedProject);
  };

  const handleApprove = (person) => {
    // Create updated team data
    const updatedTeam = {
      ...teamShow,
      queue: teamShow.queue.filter((queuePerson) => queuePerson.id !== person.id)
    };
    setTeamMembers((prev) => {
      return [...prev, { userId: person.id, teamId: teamShow.id, role: "memeber" }];
    });
    updateTeamData(teamShow.id, updatedTeam);
  };

  const handleDecline = (person) => {
    // Create updated team data with person removed from queue
    const updatedTeam = {
      ...teamShow,
      queue: teamShow.queue.filter((queuePerson) => queuePerson.id !== person.id)
    };

    // Update global state (if provided)
    if (updateTeamData) {
      updateTeamData(teamShow.id, updatedTeam);
    }
  };

  const handleProjectAddMembers = (persons) => {
    console.log(persons);
    setProjectMembers((prev) => {
      return [
        ...prev,
        ...persons.map((person) => {
          return { projectId: teamShow.id, userId: person.id, role: "member" };
        })
      ];
    });
    console.log(projectMembers);
    // Update current project
    setTeamShow(() => teamShow);
  };

  return (
    <div className="w-full px-3 overflow-y-auto col-span-7 space-y-4 h-[calc(100vh-4rem)]">
      {/* Display properties */}
      <Card className="w-full my-2 border-2 py-4 h-fit max-h-80 gap-1 overflow-auto">
        <CardHeader>
          <div className="grid grid-cols-[1fr_auto] items-start">
            <div>
              <CardTitle className="w-full font-bold text-3xl capitalize mb-2">
                {teamShow.name}
              </CardTitle>
              <CardDescription className="mt-2">Created By: {teamShow.createdBy}</CardDescription>
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
                  setSelected={null}
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

      <TeamDetailSheet
        isOpen={isOpenTeamDetails}
        onOpenChange={setIsOpenTeamDetails}
        team={teamShow}
        edit={true}
      />
      <ProjectDetailSheet
        isOpen={isOpenProjectDetails}
        onOpenChange={setIsOpenProjectDetails}
        project={teamShow}
        edit={true}
      />
      {/*Display data  */}
      <div className="w-full overflow-auto">
        <MemberDataTable
          columns={columns}
          data={usersInTeam}
          setFunction={null}
          teamShow={teamShow}
          showData={showData}
          handleApprove={handleApprove}
          handleDecline={handleDecline}
          handleProjectAddMembers={handleProjectAddMembers}
          projectMembers={projectMembers}
          manage={"members"}
        />
      </div>
    </div>
  );
};

export default MembersTable;
