import { formatDate } from 'fullcalendar'
import { getStatusClass } from '@/lib/calendar-utils';

// Use throttled mouseover handler to prevent excessive triggers
let isTooltipVisible = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Track position with debounced function (only triggers when needed)
let tooltipPositionTimeout;

export function showTooltip(mouseEvent, tooltip) {
  // Cache mouse coordinates
  lastMouseX = mouseEvent.clientX;
  lastMouseY = mouseEvent.clientY;
  
  // Only run positioning code if tooltip isn't already visible
  if (!isTooltipVisible) {
    isTooltipVisible = true;
    document.body.appendChild(tooltip);
    
    // Use requestAnimationFrame to schedule visual updates for smoother rendering
    requestAnimationFrame(() => {
      positionTooltip(tooltip);
    });
  }
};

function positionTooltip(tooltip) {
  // Get tooltip dimensions once
  const tooltipHeight = tooltip.offsetHeight;
  const tooltipWidth = tooltip.offsetWidth;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  
  // Calculate vertical position
  let top;
  if (lastMouseY + tooltipHeight + 15 > windowHeight) {
    // Not enough space below mouse, position above
    top = lastMouseY - tooltipHeight - 10;
  } else {
    // Position below mouse
    top = lastMouseY + 15;
  }
  
  // Calculate horizontal position
  let left = lastMouseX - (tooltipWidth / 2); // Center tooltip on mouse
  
  // Ensure tooltip doesn't go off-screen
  if (left < 10) {
    left = 10;
  } else if (left + tooltipWidth > windowWidth - 10) {
    left = windowWidth - tooltipWidth - 10;
  }
  
  // Apply all style changes at once for better performance
  Object.assign(tooltip.style, {
    top: `${top}px`,
    left: `${left}px`
  });
};

export function hideTooltip(tooltip) {
  if (isTooltipVisible) {
    if (document.body.contains(tooltip)) {
      document.body.removeChild(tooltip);
    }
    isTooltipVisible = false;
    
    // Clear any pending positioning updates
    if (tooltipPositionTimeout) {
      clearTimeout(tooltipPositionTimeout);
    }
  }
};


export default function CalendarTooltip(info, externalEvent = false) {
    // Create tooltip once and reuse it
    const tooltip = document.createElement('div');
    tooltip.id = 'calendar-tooltip';
    tooltip.className = 'fixed max-w-[300px] z-9999 bg-ghost-white rounded-lg shadow-lg px-3 py-2 text-[0.875rem] pointer-events-none';
    
    // Pre-populate tooltip content - avoid repeated DOM operations
    const title = info.event.title;
    const status = info.event.extendedProps.status;
    const description = info.event.extendedProps.description || '';
    
    // Prepare content outside the DOM
    let tooltipContent = `
      <div class="font-bold">${title}</div></br>
    `;
    // Due date
    if (info.event.end) {
      tooltipContent += `
        <div class="flex items-center gap-1 mb-2 min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 flex-none">
            <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5"/>
            <circle cx="16" cy="16" r="6"/>
            <path d="M16 14v2l1 1"/>
            <path d="M8 2v4"/>
            <path d="M16 2v4"/>
            <path d="M3 10h7"/>
          </svg>
          <span>${formatDate(info.event.end, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            locale: 'en-UK'
          })}</span>
        </div>
      `;
    }
    // Priority
    tooltipContent += `
    <div class="flex items-center gap-1 mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${
        info.event.extendedProps.priority === 'high' ? 'text-red-600' : 
        info.event.extendedProps.priority === 'medium' ? 'text-amber-500' : 
        'text-blue-500'
      }">
        <path d="M4 15s1-1 4-1 5 2.5 8 2.5 4-1 4-1V3s-1 1-4 1-5-2.5-8-2.5-4 1-4 1z"/>
        <path d="M4 22v-7"/>
      </svg>
      <span>Priority: ${info.event.extendedProps.priority.charAt(0).toUpperCase() + info.event.extendedProps.priority.slice(1)}</span>
    </div>
    `;
    // Add description
    if (description) {
      tooltipContent += `
        <div class="border-t border-gray-200 pt-2 mt-2">
          ${description.length <= 100 ? description : `${description.substring(0, 100)}...`}
        </div>
      `;
    }   
    // Add status badge with check-circle icon
    tooltipContent += `
    <div class="flex items-center gap-1 mt-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${
        status === 'Done' ? 'text-green-600' : 
        status === 'In Progress' ? 'text-blue-600' : 
        status === 'Blocked' ? 'text-red-600' : 
        'text-gray-600'
      }">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
      <span class="text-[0.7rem] rounded px-1 py-0.5 ${getStatusClass(status)}">${status}</span>
    </div>
    `;
    
    tooltip.innerHTML = tooltipContent;
    if (externalEvent) return tooltip; // Return tooltip for external events
    
    if (!externalEvent) {
      // Show tooltip on mouseover
      info.el.addEventListener('mouseover', (e) => {
        showTooltip(e, tooltip);
      });
      // Hide tooltip on mouseout
      info.el.addEventListener('mouseout', () => {
        hideTooltip(tooltip);
      });
    }
    // Clean up on element removal
    return () => {
      hideTooltip();
      if (!externalEvent) {
        info.el.removeEventListener('mouseover', showTooltip);
        info.el.removeEventListener('mouseout', hideTooltip);
      }
    };
  }