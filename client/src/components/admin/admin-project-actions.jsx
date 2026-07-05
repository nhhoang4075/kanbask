"use client";

import { useState } from "react";
import { MoreHorizontal, ArrowRightLeft } from "lucide-react";

import TransferProjectOwnershipDialog from "@/components/admin/actions/transfer-project-ownership-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useExclusiveMenu } from "@/hooks/use-exclusive-menu";

export default function AdminProjectActions({ project, listParams }) {
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
      <TransferProjectOwnershipDialog
        isOpen={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
        project={project}
        listParams={listParams}
      />
    </div>
  );
}
