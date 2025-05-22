"use client";

import React, { useEffect, useState } from "react";
import { projectMember, teamsMember, users } from "@/data/teams.js";
import { columns } from "./column";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import MemberDataTable from "./MemberDataTable";
import MoreButton from "../teams-ui/MoreButton";
import { useTeamContext } from "@/hooks/use-teams";
import { formatDate } from "@/lib/teams-utils";

const MembersTable = () => {
  const {
    selectedTeam,
    selectedProject,
    showData,
    updateTeamData,
    setIsOpenTeamDetails,
    setIsOpenProjectDetails,
    members
  } = useTeamContext();

  const [teamShow, setTeamShow] = useState(selectedTeam);
  const [projectMembers, setProjectMembers] = useState(projectMember);

  useEffect(() => {
    setTeamShow(() => {
      if (showData == "team") {
        return selectedTeam;
      } else if (showData == "project") {
        return selectedProject;
      }
    });
  }, []);

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
    <div className="w-full px-3 overflow-y-auto col-span-7 space-y-4 h-[calc(100vh-7rem)]">
      {/* Display properties */}
      <Card className="w-full my-2 border-2 py-4 h-fit max-h-80 gap-1 overflow-auto">
        <CardHeader>
          <div className="grid grid-cols-[1fr_auto] items-start">
            <div>
              <CardTitle className="w-full font-bold text-3xl capitalize mb-2">
                {teamShow.name}
              </CardTitle>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-right text-sm text-muted-foreground">
                <div>Created At: {formatDate(teamShow.created_at)}</div>
                <div>Updated At: {formatDate(teamShow.updated_at)}</div>
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

      {/*Display data  */}
      <div className="w-full overflow-auto">
        <MemberDataTable
          columns={columns}
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
