import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useTeamContext } from "@/hooks/use-teams";

const DeleteAlert = ({ manage, row }) => {
  const {
    selectedTeam,
    selectedProject,
    showData,
    handleRemoveMemberFromTeam,
    handleRemoveMemberFromProject,
    handleDeleteTeam,
    handleDeleteProject
  } = useTeamContext();

  const deleteTeam = () => {
    handleDeleteTeam(row[0].id);
  };

  const removeMemberFromTeam = () => {
    const memberIds = row.map((member) => member.id);
    handleRemoveMemberFromTeam(selectedTeam.id, memberIds);
  };

  const deleteProject = () => {
    handleDeleteProject(selectedProject.id, selectedProject.team_id);
  };

  const removeMembersFromProject = () => {
    const memberIds = row.map((member) => member.id);
    handleRemoveMemberFromProject(selectedProject.id, memberIds, selectedProject.team_id);
  };

  const handleDelete = () => {
    // Handle delete action here
    switch (manage) {
      case "team":
        deleteTeam();
        break;
      case "project":
        deleteProject();
        break;
      case "member":
        if (showData == "team") {
          removeMemberFromTeam();
        } else {
          removeMembersFromProject();
        }
        break;
      default:
        break;
    }
  };
  return (
    <AlertDialog className="">
      <AlertDialogTrigger
        variant="outline"
        className="w-full bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer hover:text-white rounded-md h-9"
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this and remove data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 w-18 hover:bg-red-600 hover:cursor-pointer hover:text-white"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;
