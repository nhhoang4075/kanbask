"use client";

import { useState } from "react";
import { MoreHorizontal, ArrowRightLeft } from "lucide-react";

import TransferTeamOwnershipDialog from "@/components/admin/actions/transfer-team-ownership-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useExclusiveMenu } from "@/hooks/use-exclusive-menu";

export default function AdminTeamActions({ team, listParams }) {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
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
          <DropdownMenuItem onSelect={() => setIsTransferDialogOpen(true)}>
            <ArrowRightLeft className="h-4 w-4" />
            <span>Transfer ownership</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TransferTeamOwnershipDialog
        isOpen={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
        team={team}
        listParams={listParams}
      />
    </div>
  );
}
