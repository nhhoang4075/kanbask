import { getStatusClass, handleEventClick, getPriorityClass } from "@/lib/calendar-utils";
import CalendarTooltip, { hideTooltip, showTooltip } from "./calendar-tooltip";

export default function CalendarPopup(info, calendarRef) {
  // Check if there exists a popup already
  const existingPopup = document.getElementById('custom-popup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }
  
  // Prevent default behavior
  info.jsEvent.preventDefault();
  info.jsEvent.stopPropagation();
  
  // Get the calendar element
  const calendarEl = calendarRef.current.elRef.current;
  const calendarScroller = calendarEl.querySelector('.fc-scroller-liquid-absolute');
  
  // Store original scroll position
  const scrollTop = calendarScroller ? calendarScroller.scrollTop : 0;
  calendarScroller.scrollTop = scrollTop;
  
  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'fixed z-[9999] bg-white rounded-md shadow-xl border border-gray-200 w-72 overflow-hidden';
  popup.id = 'custom-popup';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200';
  
  const dateHeading = document.createElement('h3');
  dateHeading.className = 'font-semibold text-gray-800';
  dateHeading.textContent = info.date.toLocaleDateString();
  header.appendChild(dateHeading);
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.className = 'text-gray-500 hover:text-gray-700 text-xl font-medium focus:outline-none';
  closeBtn.onclick = () => {
    document.body.removeChild(popup);
    if (calendarScroller) {
      calendarScroller.scrollTop = scrollTop;
    }
  };
  header.appendChild(closeBtn);
  
  // Add click outside handler
  const closeOnClickOutside = (e) => {
    if (!popup.contains(e.target) && document.body.contains(popup)) {
      document.body.removeChild(popup);
      document.removeEventListener('click', closeOnClickOutside);
      if (calendarScroller) {
        calendarScroller.scrollTop = scrollTop;
      }
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeOnClickOutside);
  }, 100);
  
  // Create event container
  const eventContainer = document.createElement('div');
  eventContainer.className = 'p-3 overflow-y-auto max-h-[300px] space-y-2';
  
  // Add events
  info.hiddenSegs.forEach(seg => {
    const statusClass = getStatusClass(seg.event.extendedProps.status);
    const priorityClass = getPriorityClass(seg.event.extendedProps.priority);
    
    const eventEl = document.createElement('div');
    eventEl.className = `rounded-md p-3 shadow-sm transition-all hover:shadow-md cursor-pointer ${priorityClass}`;
    eventEl.style.backgroundColor = seg.event.backgroundColor;
    
    eventEl.innerHTML = `
      <div class="flex justify-between items-center gap-2">
        <div class="font-medium text-sm truncate">${seg.event.title}</div>
        <span class="text-xs font-medium py-0.5 px-2 rounded-full whitespace-nowrap ${statusClass}">
          ${seg.event.extendedProps.status}
        </span>
      </div>
    `;
    
    eventEl.addEventListener('click', (e) => {
      e.stopPropagation();
      handleEventClick(seg);
      
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
        document.removeEventListener('click', closeOnClickOutside);
      }
    });
    
    const tooltip = CalendarTooltip(seg, true);
    eventEl.addEventListener('mouseenter', (e) => {
      showTooltip(e, tooltip);
    });
    eventEl.addEventListener('mouseleave', () => {
      hideTooltip(tooltip);
    });
    
    eventContainer.appendChild(eventEl);
  });
  
  popup.appendChild(header);
  popup.appendChild(eventContainer);
  document.body.appendChild(popup);
  
  if (calendarScroller) {
    requestAnimationFrame(() => {
      calendarScroller.scrollTop = scrollTop;
    });
  }
  
  // Position popup
  const rect = info.jsEvent.target.getBoundingClientRect();
  const popupHeight = popup.offsetHeight;
  const windowHeight = window.innerHeight;
  const spaceBelow = windowHeight - rect.bottom;
  
  if (spaceBelow < popupHeight + 10 && rect.top > popupHeight + 10) {
    popup.style.top = `${rect.top - popupHeight - 10}px`;
  } else if (spaceBelow > popupHeight + 10) {
    popup.style.top = `${rect.bottom + 10}px`;
  } else {
    popup.style.maxHeight = `${spaceBelow - 10}px`;
    popup.style.top = `${rect.top - spaceBelow - 10}px`;
    popup.style.overflowY = 'auto';
  }
  
  const viewportWidth = window.innerWidth;
  const popupWidth = popup.offsetWidth;
  
  if (rect.left + popupWidth > viewportWidth) {
    popup.style.left = `${viewportWidth - popupWidth - 10}px`;
  } else {
    popup.style.left = `${rect.left}px`;
  }
}
