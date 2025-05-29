import { createRoot } from 'react-dom/client';
import CalendarDetails from "@/components/calendar/calendar-details";

// Get the status class based on the status of the task
export function getStatusClass(status) {
  switch (status) {
    case 'In Progress':
      return 'bg-blue-200 text-blue-800';
    case 'Done':
      return 'bg-green-200 text-green-800';
    case 'To Do':
      return 'bg-amber-200 text-amber-800';
    case 'Blocked':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800'; 
  }
};

export function getPriorityClass(priority) {
  switch (priority) {
    case 'high':
      return '!border-l-8 !rounded-md !border-red-500';
    case 'medium':
      return '!border-l-8 !rounded-md !border-yellow-500';
    case 'low':
      return '!border-l-8 !rounded-md !border-blue-500';
    default:
      return '';
  }
};

// Handle event click
export function handleEventClick(clickInfo) {
  // Remove any existing popups and cleanup React roots
  const existingPopup = document.getElementById('event-detail-popup');
  // Remove any other calendar tooltips
  const existingTooltip = document.getElementById('calendar-tooltip');
  if (existingTooltip) {
    console.log('Existing tooltip:', existingTooltip);
    document.body.removeChild(existingTooltip);
  }
  
  if (existingPopup) {
    // Try to unmount any existing React root first to prevent memory leaks
    try {
      const existingRoot = existingPopup._reactRoot;
      if (existingRoot) {
        existingRoot.unmount();
      }
    } catch (e) {
      console.warn('Failed to unmount React root:', e);
    }
    document.body.removeChild(existingPopup);
  }

  // Create an overlay first for the modal effect
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
  overlay.id = 'event-detail-overlay';
  
  // Create container for the React component
  const detailPopup = document.createElement('div');
  detailPopup.className = 'bg-white shadow-xl rounded-lg p-5 w-11/12 max-w-xl h-auto max-h-[90vh] overflow-hidden flex flex-col';
  detailPopup.id = 'event-detail-popup';
  
  // Add header area
  const headerDiv = document.createElement('div');
  headerDiv.className = 'flex justify-between items-center mb-4 pb-2 border-b';
  
  // Add title
  const titleDiv = document.createElement('h2');
  titleDiv.className = 'text-xl font-bold text-prussian-blue';
  titleDiv.textContent = 'Task Details';
  headerDiv.appendChild(titleDiv);
  
  // Add close button to header
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.className = 'text-gray-600 hover:text-gray-900 text-2xl font-bold transition-colors duration-200';
  closeButton.onclick = () => {
    if (detailPopup._reactRoot) {
      detailPopup._reactRoot.unmount();
    }
    document.body.removeChild(overlay);
  };
  headerDiv.appendChild(closeButton);
  
  detailPopup.appendChild(headerDiv);
  
  // Create a container for React to render into - this will be scrollable
  const reactContainer = document.createElement('div');
  reactContainer.className = 'flex-grow overflow-y-auto pr-1';
  detailPopup.appendChild(reactContainer);
  
  // Add footer area with buttons
  const footerDiv = document.createElement('div');
  footerDiv.className = 'flex justify-end gap-2 mt-4 pt-3 border-t';
  
  // Edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Task';
  editButton.className = 'px-4 py-2 bg-blue-green text-white rounded hover:bg-prussian-blue transition-colors';
  editButton.onclick = () => {
    alert('Edit task: ' + clickInfo.event.title);
    // Link with tasks page
  };
  footerDiv.appendChild(editButton);
  
  detailPopup.appendChild(footerDiv);
  
  // Append popup to overlay, then overlay to body
  overlay.appendChild(detailPopup);
  document.body.appendChild(overlay);
  
  // Now render the React component into the container
  const root = createRoot(reactContainer);
  // Store reference to root for cleanup later
  detailPopup._reactRoot = root;
  
  // Pass only the needed properties
  root.render(<CalendarDetails info={clickInfo} />);
  
  // Close when clicking outside
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) {
      if (detailPopup._reactRoot) {
        detailPopup._reactRoot.unmount();
      }
      document.body.removeChild(overlay);
    }
  });
  
  // Add keyboard event to close with Escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (detailPopup._reactRoot) {
        detailPopup._reactRoot.unmount();
      }
      document.body.removeChild(overlay);
      document.removeEventListener('keydown', handleKeyDown);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
}