"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import Spinner from "@/components/app/spinner";
import CalendarItem from "@/components/calendar/calendar-item";
import { useSidebar } from "@/components/ui/sidebar";
import { useTask } from "@/hooks/use-task";

const PRIORITY_CLASSES = {
  low: "!bg-green-300 !border-green-700",
  medium: "!bg-amber-300 !border-amber-700",
  high: "!bg-red-300 !border-red-700",
  default: "!bg-slate-300 !border-slate-700"
};

const scrollToToday = () => {
  const todayEl = document.querySelector(".fc-day-today");
  if (todayEl) {
    todayEl.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
};

export default function CalendarWindow() {
  const calendarRef = useRef(null);
  const { myAssignedTasks, fetchMyAssignedTasks, loading } = useTask();
  const { open: sidebarOpen } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    fetchMyAssignedTasks();
  }, []);

  useEffect(() => {
    if (calendarRef.current?.getApi) {
      setTimeout(() => {
        calendarRef.current.getApi().updateSize();
        scrollToToday();
      }, 300);
    }
  }, [sidebarOpen, loading]);

  const handleEventClick = (info) => {
    const {
      id: taskId,
      extendedProps: { teamId, projectId }
    } = info.event;

    router.push(`/app/task?team=${teamId}&project=${projectId}&task=${taskId}`);
  };

  const events = useMemo(() => {
    return myAssignedTasks.map((task) => {
      const start = task.created_at;
      const end =
        task.due_date ||
        new Date(new Date(task.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

      return {
        id: task.id,
        title: task.title,
        start,
        end,
        textColor: "#000",
        extendedProps: {
          description: task.description,
          status: task.status,
          priority: task.priority,
          projectId: task.project_id,
          teamId: task.team_id
        }
      };
    });
  }, [myAssignedTasks]);

  const calendarOptions = useMemo(() => {
    return {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridMonth",
      initialDate: new Date(),
      height: "100%",
      events,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,dayGridWeek"
      },
      buttonText: {
        today: "Today",
        month: "Month",
        week: "Week"
      },
      datesSet: (dateInfo) => {
        const today = new Date();
        if (today >= dateInfo.start && today <= dateInfo.end) {
          scrollToToday();
        }
      },
      customButtons: {
        today: {
          text: "Today",
          click: () => {
            const api = calendarRef.current?.getApi();
            api?.today();
            scrollToToday();
          }
        }
      },
      views: {
        dayGridMonth: {
          titleFormat: { year: "numeric", month: "long" },
          dayHeaderFormat: { weekday: "long" },
          dayMaxEvents: 3
        },
        dayGridWeek: {
          titleFormat: { year: "numeric", month: "long", day: "2-digit" },
          dayHeaderFormat: { weekday: "short", day: "numeric", month: "numeric" },
          dayMaxEvents: 8
        }
      },
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
      eventContent: (info) => <CalendarItem info={info} />,
      eventClassNames: (eventInfo) => [
        PRIORITY_CLASSES[eventInfo.event.extendedProps.priority || "default"]
      ],
      moreLinkContent: (arg) => (
        <div className=" rounded-md p-1 m-0 text-xs font-bold bg-prussian-blue text-white hover:bg-blue-green">
          +{arg.num}
        </div>
      )
    };
  }, [events]);

  if (loading) {
    return (
      <div className="h-full w-full bg-white rounded-md flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white rounded-md p-6">
      <FullCalendar ref={calendarRef} {...calendarOptions} />

      {/* Global styles override cho FullCalendar */}
      <style jsx global>{`
        .fc .fc-toolbar-title {
          font-size: 1.8rem;
          color: #000;
          font-weight: 600;
        }

        .fc .fc-button-primary {
          background-color: var(--color-mustard);
          border-color: var(--color-mustard);
          color: var(--color-prussian-blue);
          font-size: 14px;
          padding: 4px 8px 4px !important;
          border-radius: 6px;
        }

        .fc .fc-button-primary:not(:disabled):hover {
          background-color: var(--color-prussian-blue/90);
          transition: color 0.2s ease-in-out;
        }

        .fc .fc-button:focus {
          box-shadow: none;
        }

        .fc-button-group > .fc-button:not(:first-child) {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }
        .fc-button-group > .fc-button:not(:last-child) {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
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

        .fc .fc-scrollgrid,
        .fc .fc-scrollgrid-section > * {
          border-color: #000;
        }

        .fc .fc-col-header-cell {
          background-color: var(--color-prussian-blue);
          color: var(--color-ghost-white);
          font-weight: 200;
          font-size: 16px;
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
          background-color: var(--color-mustard/50);
          font-weight: 600;
        }

        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          color: #fff;
          background-color: var(--color-prussian-blue);
          border-radius: 25%;
        }

        .fc .fc-daygrid-day {
          border-color: #000;
          transition: background-color 0.2s ease-in-out;
        }

        .fc .fc-daygrid-day-frame {
          min-height: 190px !important;
          height: 190px !important;
        }

        .fc .fc-daygrid-day:hover {
          background-color: var(--color-blue-100);
        }

        .fc-day-other .fc-daygrid-more-link {
          display: none !important;
        }import { Router } from 'express';


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
