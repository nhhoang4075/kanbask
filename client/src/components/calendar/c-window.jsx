"use client";

import { useRef, useEffect, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import Spinner from "@/components/app/spinner";
import CalendarTooltip from "@/components/calendar/calendar-tooltip";
import CalendarPopup from "@/components/calendar/calendar-popup";
import CTooltip from "@/components/calendar/c-tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { useTask } from "@/hooks/use-task";
import { handleEventClick, getPriorityClass } from "@/lib/calendar-utils";

/**
 * Hàm tiện ích để scroll đến ngày hôm nay (nếu có element tương ứng).
 */
const scrollToToday = () => {
  const todayEl = document.querySelector(".fc-day-today");
  if (todayEl) {
    todayEl.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
};

/**
 * Bản đồ màu cho độ ưu tiên, tái sử dụng trong useMemo
 */
const PRIORITY_COLORS = {
  high: "#ff2c37",
  medium: "#fe9800",
  low: "#00c950",
  default: "#90a2b9"
};

export default function CalendarWindow() {
  // 1. Tất cả Hooks phải ở đây, không được gọi tuỳ điều kiện
  const calendarRef = useRef(null);
  const { open: sidebarOpen } = useSidebar();
  const { myAssignedTasks, loading } = useTask();

  // Tạo callback cho click ngày (nếu cần)
  const handleDateClick = useCallback((info) => {
    // Ví dụ redirect:
    // router.push(`/tasks/create?date=${encodeURIComponent(info.dateStr)}`);
  }, []);

  // Memo hoá mảng events từ myAssignedTasks
  const events = useMemo(() => {
    return myAssignedTasks.map((task) => {
      const bg = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.default;
      const start = task.created_at;
      // Nếu không có due_date, tự động cộng 1 ngày
      const end =
        task.due_date ||
        new Date(new Date(task.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString();

      return {
        id: task.id,
        title: task.title,
        start,
        end,
        backgroundColor: bg,
        borderColor: bg,
        textColor: "#000",
        extendedProps: {
          description: task.description,
          status: task.status,
          priority: task.priority,
          project: task.project_id
        }
      };
    });
  }, [myAssignedTasks]);

  // Memo hoá toàn bộ options cho FullCalendar
  const calendarOptions = useMemo(() => {
    return {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: "dayGridWeek",
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
      dateClick: handleDateClick,
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
          titleFormat: { year: "numeric", month: "short", day: "2-digit" },
          dayHeaderFormat: { weekday: "long", day: "numeric", month: "numeric" },
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
      // Dùng component CTooltip để custom eventContent
      eventContent: (info) => <CTooltip info={info} />,
      // Thêm class dựa vào priority (vd: bg-red-100, bg-green-100…)
      eventClassNames: (eventInfo) => [getPriorityClass(eventInfo.event.extendedProps.priority)],
      // Tùy chỉnh nút “+n more”
      moreLinkContent: (arg) => (
        <div className="text-[13px] font-bold font-roboto bg-prussian-blue text-white p-1 m-0 rounded-md hover:bg-blue-green">
          +{arg.num}
        </div>
      ),
      moreLinkClick: (info) => {
        CalendarPopup(info, calendarRef);
        return "background";
      },
      // Khi event mount, gắn thêm CalendarTooltip (như trước)
      eventDidMount: CalendarTooltip
    };
  }, [events, handleDateClick]);

  // 2. Chỉ khi đã khai báo hết các Hook phía trên, mới có thể return theo điều kiện
  if (loading) {
    return (
      <div className="h-full w-full bg-white rounded-md flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // 3. Kết quả render chính
  return (
    <div className="h-full w-full bg-white rounded-md p-6">
      <FullCalendar ref={calendarRef} {...calendarOptions} />

      {/* Global styles override cho FullCalendar */}
      <style jsx global>{`
        .fc .fc-toolbar-title {
          font-size: 1.8rem;
          color: #000;
          font-weight: 400;
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
          transition: color 0.2 ease-in-out;
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
        }
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
