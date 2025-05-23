"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { initialData } from "@/temp-data/data";
import { cn } from "@/lib/utils";
import CalendarTooltip from "./calendar-tooltip";
import CalendarPopup from "./calendar-popup";
import { getStatusClass, handleEventClick, getPriorityClass } from "@/lib/calendar-utils";

export default function Calendar() {
  const calendarRef = useRef(null);
  const { open } = useSidebar();

  // Update calendar when sidebar changes
  useEffect(() => {
    if (calendarRef.current?.getApi) {
      // Delayed update after transition
      setTimeout(() => {
        calendarRef.current.getApi().updateSize();
      }, 200);
    }
  }, [open]);

  // Generate events with colors based on priority
  // const notDoneData = initialData.filter((event) => event.status != "Done");
  const events = initialData.map((event) => {
    let backgroundColor;
    switch (event.priority) {
      case "high":
        backgroundColor = "#ef444499";
        break;
      case "medium":
        backgroundColor = "#f59e0b99";
        break;
      case "low":
        backgroundColor = "#3b82f699";
        break;
      default:
        backgroundColor = "#6b728099";
    }

    return {
      id: event.id,
      title: event.title,
      start: event.createdAt,
      end: event.dueDate,
      backgroundColor,
      borderColor: backgroundColor,
      textColor: "#000",
      extendedProps: {
        description: event.description,
        status: event.status,
        priority: event.priority,
        assignedTo: event.assignedTo
      }
    };
  });

  return (
    <div className="bg-white p-4 m-5 h-[85%] rounded-lg shadow-md overflow-hidden">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        events={events}
        height="100%"
        initialView="dayGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek"
        }}
        views={{
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "long" },
            dayHeaderFormat: { weekday: "long" },
            dayMaxEvents: 2
          },
          dayGridWeek: {
            titleFormat: { year: "numeric", month: "short", day: "2-digit" },
            dayHeaderFormat: { weekday: "long" },
            dayMaxEvents: 8
          }
        }}
        // Event handling
        eventClick={(clickInfo) => handleEventClick(clickInfo)}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false
        }}
        // Appearance
        themeSystem="standard"
        fixedWeekCount={false}
        nowIndicator={true}
        slotEventOverlap={true}
        firstDay={1}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week"
        }}
        // Custom styles for events
        // Custom event content
        eventContent={(eventInfo) => {
          // Get event properties
          const { title, extendedProps } = eventInfo.event;
          // Create custom styles based on properties
          let statusClass = getStatusClass(extendedProps.status);
          return (
            <div
              className={cn(
                "fc-event-custom-content flex justify-between items-center",
                eventInfo.view.type === "listWeek" && "!p-0"
              )}
            >
              <div className="font-medium truncate">{title}</div>
              {eventInfo.view.type !== "listWeek" && (
                <div className={cn("text-[0.6rem] rounded px-1 mr-2", statusClass)}>
                  {extendedProps.status}
                </div>
              )}
            </div>
          );
        }}
        // Custom event class names
        eventClassNames={(eventInfo) => {
          return [getPriorityClass(eventInfo.event.extendedProps.priority)];
        }}
        // Custom more link for month/week views
        moreLinkContent={(arg) => {
          return (
            <div className="text-[13px] font-bold font-roboto bg-prussian-blue text-white p-1 !m-0 rounded-md hover:bg-blue-green">
              +{arg.num}
            </div>
          );
        }}
        // Custom more link popup for month/week views
        moreLinkClick={(info) => {
          CalendarPopup(info, calendarRef);
          return "background";
        }}
        eventDidMount={(info) => {
          CalendarTooltip(info);
        }}
      />
      {/* Add custom styles */}
      <style jsx global>{`
        /* Header styling */
        .fc .fc-toolbar-title {
          font-size: 1.5rem;
          color: #1f2937;
          font-weight: 600;
        }

        /* Toolbar button styling */
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

        /* Event styling */
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

        /* Day/week grid */
        .fc .fc-scrollgrid,
        .fc .fc-scrollgrid-section > * {
          border-color: #e5e7eb;
        }

        .fc .fc-col-header-cell {
          background-color: var(--color-prussian-blue);
          color: var(--color-ghost-white);
          font-weight: 600;
          padding: 8px;
        }

        .fc .fc-daygrid-day-number {
          margin: 8px;
          width: 30px;
          height: 30px;
          text-align: center;
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

        /* Force all days to be the same height */
        .fc .fc-daygrid-day-frame {
          min-height: 145px !important;
          height: 145px !important;
        }

        /* Hide "more" links in other month days */
        .fc-day-other .fc-daygrid-more-link {
          display: none !important;
        }

        /* Responsive styles */
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
