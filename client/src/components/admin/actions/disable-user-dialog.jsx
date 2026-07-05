"use client";

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
import { useAdmin } from "@/hooks/use-admin";

export default function DisableUserDialog({ isOpen, onOpenChange, user, listParams }) {
  const { handleSetUserEnabled } = useAdmin();

  const handleConfirm = async () => {
    await handleSetUserEnabled(user.id, false, listParams);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Disable Account</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-row items-center gap-4 p-4 my-4 rounded-md bg-red-100 border-1 border-red-600 text-red-600">
              <OctagonAlert className="h-10 w-10" />
              This will disable {user.full_name}&apos;s account. They will not be able to log in
              until re-enabled.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-end gap-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
