"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "@/hooks/use-account";

export default function DeleteAccountDialog({ email, isOpen, onOpenChange }) {
  const { handleDeleteAccount } = useAccount();
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");

  const handleConfirm = async () => {
    if (deleteConfirmEmail === email) {
      setDeleteConfirmEmail("");
      await handleDeleteAccount();
    }
  };

  const handleCancel = () => {
    setDeleteConfirmEmail("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all
            your data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmEmail">
              Type your email address <span className="font-semibold">({email})</span> to
              confirm:
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="Enter your email address"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              className="focus-visible:ring-0"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteConfirmEmail !== email}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
