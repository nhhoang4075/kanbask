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
import DeleteAlert from "./DeleteAlert";

const MoreButton = ({ object, setOpenDetails, setSelected }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 ">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4 hover:text-blue-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(object.id)}>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setOpenDetails(true);
            if (setSelected) setSelected(object);
          }}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteAlert manage={"project"} row={[object]} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreButton;
