import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { MoreVertical } from "lucide-react";
import EditProject from "./EditProject";
import DeleteAlert from "../DeleteAlert";

const ProjectMoreButton = ({ project }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.id)}>
          Copy project ID
        </DropdownMenuItem>
        <EditProject project={project} />
        <DropdownMenuSeparator />
        <DeleteAlert manage={"project"} rows={[project]} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectMoreButton;
