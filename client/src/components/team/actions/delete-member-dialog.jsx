import { OctagonAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";

export default function DeleteMemberDialog({ isOpen, onOpenChange, members, type }) {
  const { selectedTeam, handleRemoveTeamMembers } = useTeam();
  const { selectedProject, handleRemoveProjectMembers } = useProject();

  const handleDelete = async () => {
    const memberIds = members.map((member) => member.id);

    if (type === "team") {
      await handleRemoveTeamMembers(selectedTeam.id, { user_ids: memberIds });
    } else if (type === "project") {
      await handleRemoveProjectMembers(selectedProject.id, { user_ids: memberIds });
    }

    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Delete Member</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-row items-center gap-4 p-4 my-4 rounded-md bg-red-100 border-1 border-red-600 text-red-600">
              <OctagonAlert className="h-10 w-10" />
              This action can not be undone. This will permanently delete this member and remove all
              related data.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-end gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
