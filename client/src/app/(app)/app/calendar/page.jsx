"use client";

import { Calendar } from "@/components/calendar/calendar";

export default function CalendarPage() {
  return (
    <div className="h-[97dvh] bg-ghost-white">
      <h1 className="text-2xl font-bold mb-4 pl-5 pt-4">Calendar</h1>
      <Calendar />
    </div>
  );
}