import { TriangleAlert } from "lucide-react";

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

export default function LeaveTeamDialog({ isOpen, onOpenChange }) {
  const { selectedTeam, handleLeaveTeam } = useTeam();

  const handleLeave = async () => {
    await handleLeaveTeam(selectedTeam.id);

    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Leave Team</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-row items-center gap-4 p-4 my-4 rounded-md bg-yellow-100 border-1 border-yellow-600 text-yellow-600">
              <TriangleAlert className="h-10 w-10" />
              This action can not be undone. You will permanently leave this team and remove all
              related data.
            </div>
          </AlertDialogDescription>
          {selectedTeam.role === "owner" && (
            <p className="text-sm text-muted-foreground">
              You are the owner of this team. You can not leave the team.
            </p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-end gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleLeave}
            disabled={selectedTeam.role === "owner"}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
