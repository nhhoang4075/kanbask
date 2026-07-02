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
import { useProject } from "@/hooks/use-project";

export default function DeleteProjectDialog({ isOpen, onOpenChange, project }) {
  const [input, setInput] = useState("");
  const { handleDeleteProject } = useProject();

  const handleDelete = async () => {
    await handleDeleteProject(project.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Delete Project</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-row items-center gap-4 p-4 my-4 rounded-md bg-red-100 border-1 border-red-600 text-red-600">
              <OctagonAlert className="h-10 w-10" />
              This action can not be undone. This will permanently delete this project and remove
              all related data.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Label className="text-sm" htmlFor="delete-project-confirm">
          To confirm, type the project name "{project.name}" below
        </Label>
        <Input
          id="delete-project-confirm"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="focus-visible:ring-0"
        />
        <AlertDialogFooter className="flex flex-row justify-end gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={input !== project.name}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
