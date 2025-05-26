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
import DeleteAlert from "./delete-alert";
import { useTeamContext } from "@/hooks/use-teams";
import { useSession } from "@/hooks/use-session";

const MoreButton = ({ object, setOpenDetails, setSelected, manage, edit }) => {
  const { user } = useSession;
  const { handleLeaveTeam, editable } = useTeamContext();

  const handleLeave = () => {
    handleLeaveTeam(object.id);
  };

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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(object.code)}>
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
        {editable && (
          <>
            {manage == "team" && (
              <DropdownMenuItem
                onClick={() => {
                  handleLeave();
                }}
                className="text-red-600"
              >
                Leave team
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DeleteAlert manage={manage} row={[object]} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreButton;
