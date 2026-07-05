"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useProject } from "@/hooks/use-project";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

export default function TaskAssigneeAvatars({ assignees }) {
  const { projectMembers } = useProject();

  if (!assignees || assignees.length === 0) {
    return null;
  }

  return (
    <AvatarGroup className="flex items-center justify-center -space-x-2.5">
      {assignees.slice(0, 3).map((assignee) => {
        const hasLeftProject = !projectMembers?.some((m) => m.id === assignee.user_id);

        if (!hasLeftProject) {
          return (
            <Avatar key={assignee.user_id} className="h-8 w-8 text-xs">
              <AvatarImage className="object-cover" src={assignee.avatar_url} />
              <AvatarFallback style={pickAvatarColor(assignee.full_name)}>
                {getInitials(assignee.full_name)}
              </AvatarFallback>
            </Avatar>
          );
        }

        return (
          <TooltipProvider key={assignee.user_id}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 text-xs opacity-50">
                  <AvatarImage className="object-cover" src={assignee.avatar_url} />
                  <AvatarFallback style={pickAvatarColor(assignee.full_name)}>
                    {getInitials(assignee.full_name)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>No longer a project member</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
      {assignees.length > 3 && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs font-medium bg-blue-100 text-prussian-blue">
            +{assignees.length - 3}
          </AvatarFallback>
        </Avatar>
      )}
    </AvatarGroup>
  );
}
