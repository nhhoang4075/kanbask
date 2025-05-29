import { getStatusClass, handleEventClick, getPriorityClass } from "@/lib/calendar-utils";
import CalendarTooltip, { hideTooltip, showTooltip } from "./calendar-tooltip";


export default function CalendarPopup(info, calendarRef) {
  // Check if there exists a popup already
  const existingPopup = document.getElementById('custom-popup');
  if (existingPopup) {
    // If it exists, remove it
    document.body.removeChild(existingPopup);
  }
  // Prevent default behavior which might cause scrolling
  info.jsEvent.preventDefault();
  info.jsEvent.stopPropagation();
  // Get the calendar element
  const calendarEl = calendarRef.current.elRef.current;
  const calendarScroller = calendarEl.querySelector('.fc-scroller-liquid-absolute');
  
  // Store original scroll position of the calendar
  const scrollTop = calendarScroller ? calendarScroller.scrollTop : 0;
  calendarScroller.scrollTop = scrollTop; // Restore position
  // Create a custom popup element
  const popup = document.createElement('div');
  popup.className = 'flex flex-col absolute z-[9999] bg-ghost-white rounded-lg shadow-lg p-2 w-70 max-h-[350px]';
  popup.id = 'custom-popup';
  
  // Add a header and close button
  const header = document.createElement('div');
  header.className = 'px-2 py-1 border-b border-gray-200 flex justify-between items-center';
  header.innerHTML = `<h3 class="font-bold">${info.date.toLocaleDateString()}</h3>`;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.className = 'bg-none border-none text-lg text-gray-500 hover:text-gray-900 cursor-pointer';
  closeBtn.onclick = () => {
    document.body.removeChild(popup);
    if (calendarScroller) {
      calendarScroller.scrollTop = scrollTop; // Restore position
    }
  };
  header.appendChild(closeBtn);

  // Add click outside to close
  const closeOnClickOutside = (e) => {
    if (!popup.contains(e.target) && document.body.contains(popup)) {
      document.body.removeChild(popup);
      document.removeEventListener('click', closeOnClickOutside);
      if (calendarScroller) {
        calendarScroller.scrollTop = scrollTop; // Restore position
      }
    }
  };

  // Slight delay to avoid immediate closing
  setTimeout(() => {
    document.addEventListener('click', closeOnClickOutside);
  }, 100);
  
  // Create a scrollable container for events
  const eventContainer = document.createElement('div');
  eventContainer.className = 'p-2 overflow-y-auto max-h-[300px]';
  
  // Add events to the container
  info.hiddenSegs.forEach(seg => {
    let statusClass = getStatusClass(seg.event.extendedProps.status);
    let priorityClass = getPriorityClass(seg.event.extendedProps.priority);
    
    // Create a div for each event
    const eventEl = document.createElement('div');
    eventEl.className = `p-2 mb-2 rounded-lg cursor-pointer text-black ${priorityClass}`;
    eventEl.style.backgroundColor = seg.event.backgroundColor;
    eventEl.innerHTML = `
    <div class="flex justify-between items-center">
      <div class="font-medium text-[0.7rem] truncate">${seg.event.title}</div>
      <div class="text-[0.6rem] rounded px-1 mr-1 ${statusClass}">${seg.event.extendedProps.status}</div>
    </div>
    `;
    // Add event click handler
    eventEl.addEventListener('click', (e) => {
      // Prevent the popup's click outside detection from triggering
      e.stopPropagation();
      
      // Show event details (using the same handler as the main calendar)
      handleEventClick(seg);
      
      // Close the popup after handling the click
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
        document.removeEventListener('click', closeOnClickOutside);
      }
    });
     // Call tooltip function to show tooltip on hover
    const tooltip = CalendarTooltip(seg, true);
    eventEl.addEventListener('mouseenter', (e) => {
      // Show tooltip with event details
      showTooltip(e, tooltip);
    });
    eventEl.addEventListener('mouseleave', () => {
      // Hide tooltip when mouse leaves the event element
      hideTooltip(tooltip);
    });
    eventContainer.appendChild(eventEl);
  });
  
  // Assemble the popup
  popup.appendChild(header);
  popup.appendChild(eventContainer);
  // Position and show the popup
  document.body.appendChild(popup);
  if (calendarScroller) {
    requestAnimationFrame(() => {
      calendarScroller.scrollTop = scrollTop;
    });
  }
  const rect = info.jsEvent.target.getBoundingClientRect();

  // Get popup dimensions
  const popupHeight = popup.offsetHeight;
  const windowHeight = window.innerHeight;
  
  // Check if there's enough space below
  const spaceBelow = windowHeight - rect.bottom;
  
  if (spaceBelow < popupHeight + 10 && rect.top > popupHeight + 10) {
    // Not enough space below but enough space above, position above
    popup.style.top = `${rect.top - popupHeight - 10}px`;
  } else if (spaceBelow > popupHeight + 10) {
    // Enough space below, position below
    popup.style.top = `${rect.bottom + 10}px`;
  } else {
    // Don't have enough space above or below, change the height of the popup
    popup.style.maxHeight = `${spaceBelow - 10}px`;
    popup.style.top = `${rect.top - spaceBelow - 10}px`;
    popup.style.overflowY = 'auto';
  }
  // Horizontal positioning
  const viewportWidth = window.innerWidth;
  const popupWidth = popup.offsetWidth;

  // Check if popup would go off-screen to the right
  if (rect.left + popupWidth > viewportWidth) {
    popup.style.left = `${viewportWidth - popupWidth - 10}px`;
  } else {
    popup.style.left = `${rect.left}px`;
  }
}