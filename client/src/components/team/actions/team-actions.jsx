"use client";

import { useState } from "react";
import { MoreVertical, Info, Trash, OctagonX } from "lucide-react";

import TeamDetailsSheet from "@/components/team/actions/team-details-sheet";
import LeaveTeamDialog from "@/components/team/actions/leave-team-dialog";
import DeleteTeamDialog from "@/components/team/actions/delete-team-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function TeamActions({ team }) {
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
          <DropdownMenuItem onSelect={() => setIsDetailsSheetOpen(true)}>
            <Info className="h-4 w-4" />
            <span>Details</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-amber-500 focus:text-amber-500"
            onSelect={() => setIsLeaveDialogOpen(true)}
          >
            <OctagonX className="h-4 w-4" />
            <span>Leave</span>
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
      <TeamDetailsSheet isOpen={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen} />
      <LeaveTeamDialog isOpen={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen} />
      <DeleteTeamDialog isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
    </div>
  );
}
