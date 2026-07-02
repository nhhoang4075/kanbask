"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { capitalCase, cn } from "@/lib/utils";
import { pickStatusColor, pickPriorityColor } from "@/lib/task-utils";

export default function CalendarItem({ info }) {
  const { event } = info;
  const title = event.title;
  const status = event.extendedProps.status;
  const priority = event.extendedProps.priority;
  const description = event.extendedProps.description || "";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-between items-center cursor-pointer w-full h-full my-0.5 p-2 gap-2 rounded-sm">
            <div className="truncate font-medium">{title}</div>
            <Badge className={cn("rounded-sm", status ? pickStatusColor(status) : "bg-gray-600")}>
              {status ? capitalCase(status) : "No Status"}
            </Badge>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="bottom" // Bạn có thể thay đổi position: top, bottom, left, right...
          sideOffset={0} // Khoảng cách giữa trigger và content
          className="max-w-[200px] bg-ghost-white shadow-lg rounded-lg border"
        >
          <div className="space-y-2">
            <div className="text-sm font-semibold text-black">{title}</div>
            <div className="h-px bg-border my-2"></div>
            <div className="flex items-center gap-2">
              <Badge className={cn("rounded-sm", status ? pickStatusColor(status) : "bg-gray-600")}>
                {status ? capitalCase(status) : "No Status"}
              </Badge>
              <Badge
                className={cn("rounded-sm", priority ? pickPriorityColor(priority) : "bg-gray-600")}
              >
                {(priority && capitalCase(priority)) || "No Priority"}
              </Badge>
            </div>

            <p className="text-black truncate">{description}</p>
            {/* <Badge className={cn("text-[0.7rem] px-1 py-0.5", statusBadgeClass)}>{status}</Badge> */}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
