export default function CalendarHeader() {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
      <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      <div className="flex items-center gap-2">
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Settings</button>
      </div>
    </div>
  );
}