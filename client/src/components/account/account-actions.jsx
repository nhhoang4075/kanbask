"use client";

import { useState } from "react";
import { Key, Trash2 } from "lucide-react";

import DeleteAccountDialog from "@/components/account/delete-account-dialog";
import ChangePasswordDialog from "@/components/account/change-password-dialog";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/use-account";

export default function ProfileActions() {
  const { account } = useAccount();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <ChangePasswordDialog isOpen={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen} />

      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        email={account.email}
      />

      <Button variant="outline" className="w-full" onClick={() => setIsPasswordDialogOpen(true)}>
        <Key className="h-4 w-4" />
        Change Password
      </Button>

      <Button variant="destructive" className="w-full" onClick={() => setIsDeleteDialogOpen(true)}>
        <Trash2 className="h-4 w-4" />
        Delete Account
      </Button>
    </div>
  );
}
