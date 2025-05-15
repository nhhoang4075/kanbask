"use client";

import Calendar from "@/components/calendar/calendar";
import CalendarHeader from "@/components/calendar/calendar-header"; 

export default function CalendarPage() {
  return (
    <div className="h-[97dvh] bg-ghost-white">
      <CalendarHeader />
      <Calendar />
    </div>
  );
}