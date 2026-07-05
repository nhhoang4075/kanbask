"use client";

import { useState } from "react";
import { MoreHorizontal, ShieldCheck, Ban, CheckCircle2, LogOut, KeyRound } from "lucide-react";

import ChangeUserRoleDialog from "@/components/admin/actions/change-user-role-dialog";
import DisableUserDialog from "@/components/admin/actions/disable-user-dialog";
import ForceLogoutDialog from "@/components/admin/actions/force-logout-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/use-admin";
import { useExclusiveMenu } from "@/hooks/use-exclusive-menu";

export default function AdminUserActions({ user, listParams }) {
  const { handleSetUserEnabled, handleResendPasswordReset } = useAdmin();
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [isForceLogoutDialogOpen, setIsForceLogoutDialogOpen] = useState(false);
  const menuProps = useExclusiveMenu();

  return (
    <div>
      <DropdownMenu {...menuProps}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
          <DropdownMenuItem onSelect={() => setIsRoleDialogOpen(true)}>
            <ShieldCheck className="h-4 w-4" />
            <span>Change role</span>
          </DropdownMenuItem>
          {user.is_enabled ? (
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onSelect={() => setIsDisableDialogOpen(true)}
            >
              <Ban className="h-4 w-4" />
              <span>Disable account</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => handleSetUserEnabled(user.id, true, listParams)}>
              <CheckCircle2 className="h-4 w-4" />
              <span>Enable account</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setIsForceLogoutDialogOpen(true)}>
            <LogOut className="h-4 w-4" />
            <span>Force logout</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleResendPasswordReset(user.id)}>
            <KeyRound className="h-4 w-4" />
            <span>Resend password reset</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangeUserRoleDialog
        isOpen={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        user={user}
        listParams={listParams}
      />
      <DisableUserDialog
        isOpen={isDisableDialogOpen}
        onOpenChange={setIsDisableDialogOpen}
        user={user}
        listParams={listParams}
      />
      <ForceLogoutDialog
        isOpen={isForceLogoutDialogOpen}
        onOpenChange={setIsForceLogoutDialogOpen}
        user={user}
      />
    </div>
  );
}
