"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import CalendarTooltip from "./calendar-tooltip";
import CalendarPopup from "./calendar-popup";
import { getStatusClass, handleEventClick, getPriorityClass } from "@/lib/calendar-utils";
import { useCalendar } from "@/hooks/use-calendar";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

export default function Calendar() {
  const calendarRef = useRef(null);
  const { open } = useSidebar();
  const { tasks, loading, projects } = useCalendar();
  const { user } = useSession();
  const router = useRouter();

  // Function to scroll to today's cell
  const scrollToToday = () => {
    if (calendarRef.current?.getApi) {
      // Find today's cell and scroll to it
      setTimeout(() => {
        const todayEl = document.querySelector('.fc-day-today');
        if (todayEl) {
          todayEl.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  };
  // Function to handle date clicks
  const handleDateClick = (info) => {
    // Redirect to the task creation page with the selected date
    const selectedDate = info.dateStr;
    const url = `/tasks/create?date=${encodeURIComponent(selectedDate)}`;
    router.push(url);
  };

  useEffect(() => {
    if (calendarRef.current?.getApi) {
      setTimeout(() => {
        calendarRef.current.getApi().updateSize();
        // Initial scroll to today when loaded
        scrollToToday();
      }, 200);
    }
  }, [open, loading]);

  const events = tasks.map((task) => {
    const priorityColors = {
      high: "#ef444499",
      medium: "#f59e0b99",
      low: "#3b82f699",
      default: "#6b728099"
    };
    
    const backgroundColor = priorityColors[task.priority] || priorityColors.default;
    
    return {
      id: task.id,
      title: task.title,
      start: task.created_at,
      end: task.due_date || new Date(new Date(task.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      backgroundColor,
      borderColor: backgroundColor,
      textColor: "#000",
      extendedProps: {
        description: task.description,
        status: task.status === "done" ? "Done" : 
                  task.status === "in_progress" ? "In Progress" : 
                    task.status === "todo" ? "To Do" : "Pending",
        priority: task.priority || "No Priority",
        assignedTo: task.assignees || [user],
        project: projects.find((project) => project.id === task.project_id)?.name || "No Project",
      }
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80dvh] w-[95dvw]">
        <div className="text-white text-2xl">Loading calendar...</div>
      </div>
    );
  }

  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    events,
    height: "100%",
    initialView: "dayGridWeek",
    initialDate: new Date(), // Ensure we start on today's date
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek"
    },
    dateClick: handleDateClick,
    // Handle dates rendered - scroll to today
    datesSet: (dateInfo) => {
      // Only scroll if today is visible in the current view
      const today = new Date();
      if (today >= dateInfo.start && today <= dateInfo.end) {
        scrollToToday();
      }
    },
    // Custom buttons
    customButtons: {
      today: {
        text: 'Today',
        click: function() {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.today();
          scrollToToday();
        }
      }
    },
    // View options
    views: {
      dayGridMonth: {
        titleFormat: { year: "numeric", month: "long" },
        dayHeaderFormat: { weekday: "long" },
        dayMaxEvents: 3
      },
      dayGridWeek: {
        titleFormat: { year: "numeric", month: "short", day: "2-digit" },
        dayHeaderFormat: { weekday: "long" },
        dayMaxEvents: 8
      }
    },
    // Event click handler
    eventClick: handleEventClick,
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      meridiem: false,
      hour12: false
    },
    themeSystem: "standard",
    fixedWeekCount: false,
    nowIndicator: true,
    slotEventOverlap: true,
    firstDay: 1,
    buttonText: {
      today: "Today",
      month: "Month",
      week: "Week"
    },
    // Custom rendering for event content
    eventContent: (eventInfo) => {
      const { title, extendedProps } = eventInfo.event;
      const statusClass = getStatusClass(extendedProps.status);
      return (
        <div className={cn(
          "fc-event-custom-content flex justify-between items-center",
          eventInfo.view.type === "listWeek" && "!p-0"
        )}>
          <div className="font-medium truncate">{title}</div>
          {eventInfo.view.type !== "listWeek" && (
            <div className={cn("text-[0.6rem] rounded px-1 mr-2", statusClass)}>
              {extendedProps.status}
            </div>
          )}
        </div>
      );
    },
    // Custom class names for events based on priority
    eventClassNames: (eventInfo) => [getPriorityClass(eventInfo.event.extendedProps.priority)],
    moreLinkContent: (arg) => (
      <div className="text-[13px] font-bold font-roboto bg-prussian-blue text-white p-1 !m-0 rounded-md hover:bg-blue-green">
        +{arg.num}
      </div>
    ),
    // Handle more link clicks
    moreLinkClick: (info) => {
      CalendarPopup(info, calendarRef);
      return "background";
    },
    eventDidMount: CalendarTooltip
  };

  return (
    <div className="bg-white p-4 my-2 h-[90%] rounded-lg shadow-md overflow-hidden">
      <FullCalendar ref={calendarRef} {...calendarOptions} />
      
      <style jsx global>{`
        .fc .fc-toolbar-title {
          font-size: 1.5rem;
          color: #1f2937;
          font-weight: 600;
        }

        .fc .fc-button-primary {
          background-color: var(--color-blue-green);
          border-color: var(--color-blue-green);
          padding: 8px 8px 9px !important;
          border-radius: 20px;
        }

        .fc .fc-button-primary:not(:disabled):hover {
          background-color: var(--color-blue-green);
          border-color: var(--color-blue-green);
          opacity: 0.8;
        }

        .fc-button-group > .fc-button:not(:first-child) {
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }

        .fc-button-group > .fc-button:not(:last-child) {
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }

        .fc .fc-button-primary:not(:disabled):active,
        .fc .fc-button-primary:not(:disabled).fc-button-active {
          color: #fff;
          background-color: var(--color-prussian-blue);
          border-color: var(--color-prussian-blue);
        }

        .fc-event {
          border-radius: 8px;
          font-size: 0.7rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
          margin-bottom: 6px;
          cursor: pointer;
        }

        .fc-event-custom-content {
          padding: 6px 4px 6px 12px;
        }

        .fc .fc-scrollgrid,
        .fc .fc-scrollgrid-section > * {
          border-color: #000;
        }

        .fc .fc-col-header-cell {
          background-color: var(--color-prussian-blue);
          color: var(--color-ghost-white);
          font-weight: 600;
          padding: 8px;
        }

        .fc .fc-daygrid-day-number {
          margin: 8px;
          width: 32px;
          height: 32px;
          text-align: center;
          font-size: 1.2rem;
          padding: 2px 4px 4px 4px;
        }

        .fc .fc-daygrid-day.fc-day-today {
          background-color: var(--color-sky-blue);
          font-weight: 600;
        }

        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          color: #fff;
          background-color: var(--color-prussian-blue);
          border-radius: 25%;
        }
        .fc .fc-daygrid-day {
          border-color: #000;
        }

        .fc .fc-daygrid-day-frame {
          min-height: 190px !important;
          height: 190px !important;
          transition: background-color 0.2s ease-in-out;
        }
        .fc .fc-daygrid-day:hover {
          background-color: var(--color-blue-100);
        }

        .fc-day-other .fc-daygrid-more-link {
          display: none !important;
        }

        /* Add scroll behavior for smoother scrolling */
        .fc-scroller {
          scroll-behavior: smooth;
        }
        
        @media (max-width: 768px) {
          .fc .fc-toolbar {
            flex-direction: column;
            gap: 8px;
          }

          .fc .fc-toolbar-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
