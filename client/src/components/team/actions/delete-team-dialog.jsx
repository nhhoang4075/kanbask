import { useState } from "react";
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
import { Input } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { useTeam } from "@/hooks/use-team";

export default function DeleteTeamDialog({ isOpen, onOpenChange }) {
  const [input, setInput] = useState("");
  const { selectedTeam, handleDeleteTeam } = useTeam();

  const handleDelete = async () => {
    await handleDeleteTeam(selectedTeam.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Delete Team</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-row items-center gap-4 p-4 my-4 rounded-md bg-red-100 border-1 border-red-600 text-red-600">
              <OctagonAlert className="h-10 w-10" />
              This action can not be undone. This will permanently delete this team and remove all
              related data.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Label className="text-sm" htmlFor="delete-team-confirm">
          To confirm, type the team name "{selectedTeam.name}" below
        </Label>
        <Input
          id="delete-team-confirm"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="focus-visible:ring-0"
        />
        <AlertDialogFooter className="flex flex-row justify-end gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={input !== selectedTeam.name}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
