import { getStatusClass, getPriorityClass } from "@/lib/calendar-utils";

export default function CalendarDetails({ info }) {
  const { title, extendedProps } = info.event;
  const { description, status, priority, assignedTo } = extendedProps;
  
  return (
    <div className="calendar-details p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      
      <div className="mb-2">
        <span className="font-medium text-gray-700">Status: </span>
        <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusClass(status)}`}>
          {status}
        </span>
      </div>
      
      <div className="mb-2">
        <span className="font-medium text-gray-700">Priority: </span>
        <span className="capitalize">{priority}</span>
      </div>
      
      {info.event.end && (
        <div className="mb-2">
          <span className="font-medium text-gray-700">Due Date: </span>
          <span>{new Date(info.event.end).toLocaleDateString("en-UK")}</span>
        </div>
      )}
      
      {description && (
        <div className="mb-2">
          <p className="font-medium text-gray-700">Description:</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      )}
      
      {/* Handle the assignedTo object properly */}
      {assignedTo && (
        <div className="mb-2">
          <span className="font-medium text-gray-700">Assigned To: </span>
            {assignedTo.map(user => (
              <div key={user.id} className="flex items-center">
                <img
                    src={user.avatar} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                <span>{user.name}</span>
              </div>
          ))}
          </div>
      )}
      </div>
      
  );
}