"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import EditMemberDialog from "@/components/team/actions/edit-member-dialog";
import DeleteMemberDialog from "@/components/team/actions/delete-member-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useExclusiveMenu } from "@/hooks/use-exclusive-menu";

export default function TeamMemberActions({ member }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 focus:text-red-500"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditMemberDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        member={member}
        type="team"
      />
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        members={[member]}
        type="team"
      />
    </div>
  );
}
