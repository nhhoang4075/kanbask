"use client";

import { useState } from "react";
import { MoreVertical, Info, Trash } from "lucide-react";

import ProjectDetailsSheet from "@/components/team/actions/project-details-sheet";
import DeleteProjectDialog from "@/components/team/actions/delete-project-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function ProjectActions({ project }) {
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
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
            className="text-red-500 focus:text-red-500"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProjectDetailsSheet isOpen={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen} />
      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        project={project}
      />
    </div>
  );
}
