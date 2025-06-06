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
import { useTaskAttachment } from "@/hooks/use-task-attachment";
import { useSession } from "@/hooks/use-session";

export default function DeleteAttachmentAlert({ isOpen, onOpenChange, attachment }) {
  const { handleDeleteAttachments } = useTaskAttachment();
  const { user } = useSession();

  const handleDelete = async () => {
    await handleDeleteAttachments(attachment.task_id, [attachment.id]);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Delete Attachment</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-row items-center gap-4 p-4 my-4 rounded-md bg-red-100 border-1 border-red-600 text-red-600">
              <OctagonAlert className="h-10 w-10" />
              This action can not be undone. This will permanently delete this attachment.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {attachment?.attacher_id === user.id ? (
          <p className="text-sm mb-2">Are you sure to delete your uploaded attachment?</p>
        ) : (
          <p className="text-sm mb-2">
            This attachment is uploaded by{" "}
            <span className="font-bold">{attachment?.attacher_full_name}</span>. Are you sure to
            delete it?
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
