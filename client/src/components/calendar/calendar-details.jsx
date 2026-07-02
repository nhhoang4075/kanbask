import { getStatusClass, getPriorityClass } from "@/lib/calendar-utils";

export default function CalendarDetails({ info }) {
  const { title, extendedProps } = info.event;
  const { description, status, priority, assignedTo, project } = extendedProps;
  
  return (
    <div className="calendar-details p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <span className="font-medium text-gray-700">Status: </span>
          <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
        
        <div>
          <span className="font-medium text-gray-700">Priority: </span>
          <span className={`inline-block px-2 py-1 rounded text-xs`}>
            {priority}
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <span className="font-medium text-gray-700">Project: </span>
        <span className="capitalize">{project || "No Project"}</span>
      </div>
      
      {info.event.end && (
        <div className="mb-3">
          <span className="font-medium text-gray-700">Due Date: </span>
          <span>{new Date(info.event.end).toLocaleDateString("en-UK")}</span>
        </div>
      )}
      
      {description && (
        <div className="mb-3">
          <p className="font-medium text-gray-700">Description:</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      )}
      
      {assignedTo?.length > 0 && (
        <div>
          <p className="font-medium text-gray-700 mb-1">Assigned To:</p>
          <div className="flex flex-wrap gap-2">
            {assignedTo.map(user => (
              <div key={user.user_id} className="flex items-center bg-gray-50 p-1 rounded">
                <img
                  src={user.avatar_url} 
                  alt={user.full_name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm">{user.full_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}