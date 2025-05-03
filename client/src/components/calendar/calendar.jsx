import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useRef, useEffect } from 'react'
import { useSidebar } from '@/components/ui/sidebar'
import { initialData } from "@/temp-data/data"
import { cn } from "@/lib/utils"
import { formatDate } from 'fullcalendar'

export function Calendar() {
  const calendarRef = useRef(null);
  const { open } = useSidebar();

  // Update calendar when sidebar changes
  useEffect(() => {
    if (calendarRef.current?.getApi) {
      // Delayed update after transition
      setTimeout(() => {
        calendarRef.current.getApi().updateSize();
      }, 200);
    }
  }, [open]);

  // Handle event click
  const handleEventClick = (clickInfo) => {
    alert(`Task: ${clickInfo.event.title}`);
    // You could navigate to task detail page here
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'Blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800'; 
    }
  };

  // Generate events with colors based on priority
  const notDoneData = initialData.filter((event) => event.status != "Done");
  const events = notDoneData.map((event) => {
    let backgroundColor;
    switch (event.priority) {
      case 'high': backgroundColor = '#ef444477'; break;
      case 'medium': backgroundColor = '#f59e0b77'; break;
      case 'low': backgroundColor = '#3b82f677'; break;
      default: backgroundColor = '#6b728077';
    }
    
    return {
      id: event.id,
      title: event.title,
      start: event.createdAt,
      end: event.dueDate,
      backgroundColor,
      borderColor: backgroundColor,
      textColor: '#000',
      extendedProps: {
        description: event.description,
        status: event.status,
        priority: event.priority,
        assignedTo: event.assignedTo
      }
    };
  });

  return (
    <div className="bg-white p-4 m-5 h-[87%] rounded-lg shadow-md overflow-hidden">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        events={events}
        height="100%"
        initialView='dayGridWeek'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        views={{
          dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' },
            dayHeaderFormat: {weekday: 'long'},
            dayMaxEvents: 2
          },
          dayGridWeek: {
            titleFormat: { year: 'numeric', month: 'short', day: '2-digit' },
            dayMaxEvents: 8,
          }
        }}
        // Event handling
        eventClick={handleEventClick}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
        // Appearance
        themeSystem="standard"
        fixedWeekCount={false}
        nowIndicator={true}
        slotEventOverlap={true}
        firstDay={1}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
        }}
        // Custom styles for events
        // Custom event content
        eventContent={(eventInfo) => {
          // Get event properties
          const { title, extendedProps } = eventInfo.event;
          // Create custom styles based on properties
          let statusClass = getStatusClass(extendedProps.status);
          return (
            <div 
              className={cn(
                "fc-event-custom-content flex justify-between items-center", 
                eventInfo.view.type === 'listWeek' && "!p-0"
              )}
            >
              <div className="font-medium truncate">{title}</div>
              {eventInfo.view.type !== 'listWeek' && (
                <div className={cn("text-[0.6rem] rounded px-1 mr-2", statusClass)}>
                  {extendedProps.status}
                </div>
              )}
            </div>
          );
        }}
        // Custom event class names
        eventClassNames={(eventInfo) => {
          let priorityClass = '';
          // Priority-based styles
          switch (eventInfo.event.extendedProps.priority) {
            case 'high':
              priorityClass = '!border-l-8 !rounded-md !border-red-500';
              break;
            case 'medium':
              priorityClass = '!border-l-8 !rounded-md !border-yellow-500';
              break;
            case 'low':
              priorityClass = '!border-l-8 !rounded-md !border-blue-500';
              break;
          }
          return [priorityClass];
        }}
        // Custom more link for month/week views
        moreLinkContent={(arg) => {
          return (
            <div className='text-[13px] font-bold font-roboto'>+{arg.num}</div>
          )
        }}
        // Custom more link popup for month/week views
        moreLinkClick={(info) => {
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
            let priorityClass = '';
            // Priority-based styles
            switch (seg.event.extendedProps.priority) {
              case 'high':
                priorityClass = '!border-l-8 !rounded-md !border-red-500';
                break;
              case 'medium':
                priorityClass = '!border-l-8 !rounded-md !border-yellow-500';
                break;
              case 'low':
                priorityClass = '!border-l-8 !rounded-md !border-blue-500';
                break;
            }
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

          return "background";
        }}
        eventDidMount={(info) => {
          // Create tooltip once and reuse it
          const tooltip = document.createElement('div');
          tooltip.className = 'fixed max-w-[300px] z-9999 bg-ghost-white rounded-lg shadow-lg px-3 py-2 text-[0.875rem] pointer-events-none';
          
          // Pre-populate tooltip content - avoid repeated DOM operations
          const title = info.event.title;
          const status = info.event.extendedProps.status;
          const description = info.event.extendedProps.description || '';
          
          // Prepare content outside the DOM
          let tooltipContent = `
            <div class="font-bold">${title}</div></br
          `;
          tooltipContent += `<div class="text-[0.6rem]">${formatDate(info.event.end, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}</div>`;
          if (description && description.length <= 100) {
            tooltipContent += `
              <div>${description}</div>
            `;
          } else {
            tooltipContent = `
              <div>${description.substring(0, 100)}...</div>
            `;
          }
          tooltipContent += `
            <div class="text-[0.6rem] rounded px-1 mt-1 w-fit ${getStatusClass(status)}">${status}</div>
          `
          
          tooltip.innerHTML = tooltipContent;
          
          // Use throttled mouseover handler to prevent excessive triggers
          let isTooltipVisible = false;
          let lastMouseX = 0;
          let lastMouseY = 0;
          
          // Track position with debounced function (only triggers when needed)
          let tooltipPositionTimeout;
          
          const showTooltip = (mouseEvent) => {
            // Cache mouse coordinates
            lastMouseX = mouseEvent.clientX;
            lastMouseY = mouseEvent.clientY;
            
            // Only run positioning code if tooltip isn't already visible
            if (!isTooltipVisible) {
              isTooltipVisible = true;
              document.body.appendChild(tooltip);
              
              // Use requestAnimationFrame to schedule visual updates for smoother rendering
              requestAnimationFrame(() => {
                positionTooltip();
              });
            }
          };
          
          const positionTooltip = () => {
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
          
          const hideTooltip = () => {
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
          
          // Add events with better handling
          info.el.addEventListener('mouseenter', showTooltip);
          info.el.addEventListener('mouseleave', hideTooltip);
          
          // Clean up on element removal
          return () => {
            hideTooltip();
            info.el.removeEventListener('mouseenter', showTooltip);
            info.el.removeEventListener('mouseleave', hideTooltip);
          };
        }}
      />
    {/* Add custom styles */}
    <style jsx global>{`
      /* Header styling */
      .fc .fc-toolbar-title {
        font-size: 1.5rem;
        color: #1f2937;
        font-weight: 600;
      }

      /* Toolbar button styling */
      .fc .fc-button-primary {
        background-color: var(--color-blue-green);
        border-color: var(--color-blue-green);
        padding: 5px 8px 8px 8px !important;
      }
      
      .fc .fc-button-primary:not(:disabled):hover {
        background-color: var(--color-blue-green);
        border-color: var(--color-blue-green);
        opacity: 0.8;
      }
      
      .fc-button-group > .fc-button:not(:first-child) {
        border-top-right-radius: 20;
        border-bottom-right-radius: 20;
      }

      .fc-button-group > .fc-button:not(:last-child) {
        border-top-left-radius: 20;
        border-bottom-left-radius: 20;
      }

      .fc .fc-button-primary:not(:disabled):active,
      .fc .fc-button-primary:not(:disabled).fc-button-active {
        color: #fff;
        background-color: var(--color-prussian-blue);
        border-color: var(--color-prussian-blue);
      }
      
      /* Event styling */
      .fc-event {
        border-radius: 8px;
        font-size: 0.7rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        margin-bottom: 6px;
        cursor: pointer;
      }
      
      .fc-event-custom-content {
        padding: 6px 4px 6px 12px;
      }
      
      /* Day/week grid */
      .fc .fc-scrollgrid,
      .fc .fc-scrollgrid-section > * {
        border-color: #e5e7eb;
      }
      
      .fc .fc-col-header-cell {
        background-color: var(--color-prussian-blue);
        color: var(--color-ghost-white);
        font-weight: 600;
        padding: 8px;
      }
      
      .fc .fc-daygrid-day-number {
        margin: 8px;
        width: 30px;
        height: 30px;
        text-align: center;
        padding: 2px 4px 4px 4px;
      }
      
      .fc .fc-daygrid-day.fc-day-today {
        background-color: var(--color-sky-blue);
        font-weight: 600;
      }

      .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
        color: #fff;
        background-color: var(--color-prussian-blue);
        border-radius: 25%;
      }
      /* Force all days to be the same height */
      .fc .fc-daygrid-day-frame {
        min-height: 145px !important;
        height: 145px !important;
      }
      /* Hide "more" links in other month days */
      .fc-day-other .fc-daygrid-more-link {
        display: none !important;
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .fc .fc-toolbar {
          flex-direction: column;
          gap: 8px;
        }
        
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
        }
      }
    `}</style>
    </div>
  );
}
