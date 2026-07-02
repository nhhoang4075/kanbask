"use client";

import { useEffect } from "react";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskLog } from "@/hooks/use-task-log";
import { getActivityDescription } from "@/lib/task-utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { formatDateShort, formatTimestampHour, formatFullTimestamp } from "@/lib/utils";

function groupLogsByDate(logs) {
  const groups = {};

  logs
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .forEach((log) => {
      const date = new Date(log.created_at);
      const dateKey = formatDateShort(date);

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date,
          logs: []
        };
      }

      groups[dateKey].logs.push(log);
    });

  return Object.values(groups).sort((a, b) => b.date - a.date);
}

export default function HistoryList({ task }) {
  const { logs, fetchLogs } = useTaskLog();

  useEffect(() => {
    fetchLogs(task.id);
  }, [task.id]);

  const groupedLogs = groupLogsByDate(logs);

  return (
    <ScrollArea className="h-[calc(100vh-124px)] px-6">
      <div className="space-y-8 pb-6">
        {groupedLogs.map(({ date, logs }) => (
          <div key={formatDateShort(date)} className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {format(date, "EEE")}
                </span>
                <span className="text-3xl font-bold">{format(date, "d")}</span>
              </div>
              <div className="h-px w-full bg-border" />
            </div>
            <div className="space-y-4 px-6">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4">
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <div className="text-xs text-muted-foreground flex-shrink-0 w-10 mt-1.5">
                          {formatTimestampHour(log.created_at)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-prussian-blue text-white">
                        {formatFullTimestamp(log.created_at)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Avatar className="h-8 w-8 flex-shrink-0 text-sm">
                    <AvatarImage src={log.avatar_url} alt={log.full_name} className="object-cover"/>
                    <AvatarFallback style={pickAvatarColor(log.full_name)}>
                      {getInitials(log.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-sm text-muted-foreground">
                    <span className="font-medium text-black">{log.full_name + " "}</span>
                    {getActivityDescription(log.action, log.details)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
