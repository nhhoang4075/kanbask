// src/components/calendar/CalendarTooltip.jsx
"use client";

import { useMemo } from "react";
import { formatDate } from "fullcalendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Nếu muốn combine className

/**
 * getStatusClass(status) → trả về class Tailwind cho background/text của Badge
 * Ví dụ: "bg-green-100 text-green-800" với status === "Done"
 */
import { getStatusClass } from "@/lib/calendar-utils";

export default function CalendarTooltip({ info }) {
  const { event } = info;
  const title = event.title;
  const status = event.extendedProps.status;
  const priority = event.extendedProps.priority;
  const description = event.extendedProps.description || "";

  // Format ngày (nếu có end)
  const dueDate = event.end
    ? formatDate(event.end, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        locale: "en-UK"
      })
    : null;

  // Capitalize priority
  const priorityText = useMemo(() => {
    if (!priority) return "None";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }, [priority]);

  // Màu icon priority dựa vào priority
  const priorityColorClass = useMemo(() => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-gray-600";
    }
  }, [priority]);

  // Màu icon status dựa vào status
  const statusColorClass = useMemo(() => {
    switch (status) {
      case "Done":
        return "text-green-600";
      case "In Progress":
        return "text-blue-600";
      case "To Do":
        return "text-amber-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }, [status]);

  // CSS class cho badge status cũng từ getStatusClass(status)
  const statusBadgeClass = getStatusClass(status);

  return (
    // TooltipProvider nên được wrap ở root App (ở layout) nếu muốn
    <TooltipProvider>
      <Tooltip>
        {/* TooltipTrigger: wrap toàn bộ event element */}
        <TooltipTrigger asChild>
          <div
            className="cursor-pointer w-full h-full"
            // Chúng ta để FullCalendar tự render event element rồi chúng ta wrap trong <div>
            // Nếu muốn custom event element thêm, bạn có thể gắn thêm className hoặc style vào đây.
          >
            {/** FullCalendar sẽ render tiêu đề event ở đây */}
            <div>{title}</div>
          </div>
        </TooltipTrigger>

        <TooltipContent
          align="top" // Bạn có thể thay đổi position: top, bottom, left, right...
          sideOffset={8} // Khoảng cách giữa trigger và content
          className="max-w-[300px] bg-ghost-white text-[0.875rem] shadow-lg rounded-lg border"
        >
          {/* Nội dung tooltip (dùng Shadcn UI và JSX thay vì innerHTML) */}
          <div className="flex flex-col gap-2">
            {/* Tiêu đề (bold) */}
            <div className="text-base font-semibold">{title}</div>

            {/* Due date */}
            {dueDate && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {/* <CalendarIcon className="h-4 w-4 text-red-600 flex-none" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 flex-none text-red-600"
                >
                  <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5" />
                  <circle cx="16" cy="16" r="6" />
                  <path d="M16 14v2l1 1" />
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <path d="M3 10h7" />
                </svg>
                <span>{dueDate}</span>
              </div>
            )}

            {/* Priority */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 flex-none ${priorityColorClass}`}
              >
                <path d="M4 15s1-1 4-1 5 2.5 8 2.5 4-1 4-1V3s-1 1-4 1-5-2.5-8-2.5-4 1-4 1z" />
                <path d="M4 22v-7" />
              </svg>
              <span>Priority: {priorityText}</span>
            </div>

            {/* Description (cắt nếu quá dài) */}
            {description && (
              <div className="text-sm text-muted-foreground max-h-20 overflow-hidden">
                {description.length <= 100 ? description : `${description.substring(0, 100)}...`}
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 flex-none ${statusColorClass}`}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <Badge className={cn("text-[0.7rem] px-1 py-0.5", statusBadgeClass)}>{status}</Badge>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
