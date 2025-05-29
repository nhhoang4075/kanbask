import Calendar from "@/components/calendar/calendar";
import CalendarHeader from "@/components/calendar/calendar-header";

export const metadata = {
  title: "Calendar",
  description: "Your Kanbask calendar and schedule"
};

export default function CalendarPage() {
  return (
    <div className="h-[97dvh] bg-ghost-white">
      <CalendarHeader />
      <Calendar />
    </div>
  );
}
