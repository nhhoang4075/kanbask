import { createRoot } from 'react-dom/client';
import CalendarDetails from "@/components/calendar/calendar-details";

// Status styling map
const STATUS_CLASSES = {
  'In Progress': 'bg-blue-200 text-blue-800',
  'Done': 'bg-green-200 text-green-800',
  'To Do': 'bg-amber-200 text-amber-800',
  'Cancelled': 'bg-red-200 text-red-800',
  'default': 'bg-gray-200 text-gray-800'
};

// Priority styling map
const PRIORITY_CLASSES = {
  'high': '!border-l-8 !rounded-md !border-red-500',
  'medium': '!border-l-8 !rounded-md !border-yellow-500',
  'low': '!border-l-8 !rounded-md !border-blue-500',
  'default': '!border-l-8 !rounded-md !border-gray-500'
};

// Get the status class based on the status of the task
export function getStatusClass(status) {
  return STATUS_CLASSES[status] || STATUS_CLASSES.default;
}

export function getPriorityClass(priority) {
  return PRIORITY_CLASSES[priority] || PRIORITY_CLASSES.default;
}

// Helper to clean up existing popups
function removeExistingPopups() {
  // Remove any existing tooltips
  const existingTooltip = document.getElementById('calendar-tooltip');
  if (existingTooltip) {
    document.body.removeChild(existingTooltip);
  }
  
  // Remove any existing detail popups
  const existingPopup = document.getElementById('event-detail-overlay');
  if (existingPopup) {
    try {
      const detailElement = document.getElementById('event-detail-popup');
      if (detailElement && detailElement._reactRoot) {
        detailElement._reactRoot.unmount();
      }
    } catch (e) {
      console.warn('Failed to unmount React root:', e);
    }
    document.body.removeChild(existingPopup);
  }
}

// Create a modal popup for event details
function createEventDetailModal(clickInfo) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
  overlay.id = 'event-detail-overlay';
  
  // Create detail popup container
  const detailPopup = document.createElement('div');
  detailPopup.className = 'bg-white shadow-xl rounded-lg p-5 w-11/12 max-w-xl h-auto max-h-[90vh] overflow-hidden flex flex-col';
  detailPopup.id = 'event-detail-popup';
  
  // Build modal content
  detailPopup.innerHTML = `
    <div class="flex justify-between items-center mb-4 pb-2 border-b">
      <h2 class="text-xl font-bold text-prussian-blue">Task Details</h2>
      <button id="close-modal-btn" class="text-gray-600 hover:text-gray-900 text-2xl font-bold transition-colors duration-200">×</button>
    </div>
    <div id="react-container" class="flex-grow overflow-y-auto pr-1"></div>
    <div class="flex justify-end gap-2 mt-4 pt-3 border-t">
      <button id="edit-task-btn" class="px-4 py-2 bg-blue-green text-white rounded hover:bg-prussian-blue transition-colors">Edit Task</button>
    </div>
  `;
  
  overlay.appendChild(detailPopup);
  document.body.appendChild(overlay);
  
  return {
    overlay,
    detailPopup,
    reactContainer: detailPopup.querySelector('#react-container')
  };
}

// Close the modal
function closeModal() {
  const overlay = document.getElementById('event-detail-overlay');
  const detailPopup = document.getElementById('event-detail-popup');
  
  if (detailPopup && detailPopup._reactRoot) {
    detailPopup._reactRoot.unmount();
  }
  
  if (overlay) {
    document.body.removeChild(overlay);
  }
  
  document.removeEventListener('keydown', handleEscapeKey);
}

// Handle Escape key press
function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

// Handle event click
export function handleEventClick(clickInfo) {
  // Clean up any existing popups first
  removeExistingPopups();
  
  // Create the modal
  const { overlay, detailPopup, reactContainer } = createEventDetailModal(clickInfo);
  
  // Set up event handlers
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  document.getElementById('edit-task-btn').addEventListener('click', () => {
    alert('Edit task: ' + clickInfo.event.title);
    // Link with tasks page
  });
  
  // Close when clicking outside
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
  
  // Handle escape key
  document.addEventListener('keydown', handleEscapeKey);
  
  // Render React component
  const root = createRoot(reactContainer);
  detailPopup._reactRoot = root;
  root.render(<CalendarDetails info={clickInfo} />);
}
