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

export default function ForceLogoutDialog({ isOpen, onOpenChange, user }) {
  const { handleForceLogoutUser } = useAdmin();

  const handleConfirm = async () => {
    await handleForceLogoutUser(user.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Force Logout</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-row items-center gap-4 p-4 my-4 rounded-md bg-red-100 border-1 border-red-600 text-red-600">
              <OctagonAlert className="h-10 w-10" />
              This will end all active sessions for {user.full_name}. They will need to log in
              again.
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
