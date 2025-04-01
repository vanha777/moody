'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  isSameMonth
} from 'date-fns';
import BookingOverlay from './bookingOverlay';
import AddBookingOverlay from './addBookingOverlay';
import SimpleSideBar from './simpleSideBar';
import { motion } from 'framer-motion';
import { CalendarEvent } from './booking';
import { useAppContext } from '@/app/utils/AppContext';

interface CustomCalendarProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

type CalendarView = 'day' | 'week' | 'month' | 'list';

const CustomCalendar: React.FC<CustomCalendarProps> = ({ events, onEventClick }) => {
  const { notifications, removeNotification } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('day');
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [monthDays, setMonthDays] = useState<Date[][]>([]);
  const [displayHours, setDisplayHours] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  // this is for testing purposes
  // const [currentTime, setCurrentTime] = useState(() => {
  //   const today = new Date();
  //   today.setHours(10, 0, 0, 0); // Set to 5 PM
  //   return today;
  // });

  // Update current time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 15 * 60 * 1000); // Update every 15 minutes

    return () => clearInterval(timeInterval);
  }, []);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Set up hours display (8am-8pm)
  useEffect(() => {
    const hours = [];
    for (let i = 8; i <= 20; i++) {
      hours.push(`${i % 12 === 0 ? 12 : i % 12}:00 ${i < 12 ? 'AM' : 'PM'}`);
    }
    setDisplayHours(hours);
  }, []);

  // Set up week display
  const generateWeekDays = useCallback((date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const days = [];

    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }

    return days;
  }, []);

  // Set up month display
  const generateMonthDays = useCallback((date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    // Start from the Monday of the week that contains the first day of the month
    const monthStart = startOfWeek(start, { weekStartsOn: 1 });

    // End on the Sunday of the week that contains the last day of the month
    const monthEnd = endOfWeek(end, { weekStartsOn: 1 });

    const weeks: Date[][] = [];
    let week: Date[] = [];
    let currentDay = monthStart;

    // Generate array of dates for the month view
    while (currentDay <= monthEnd) {
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }

      week.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }, []);

  // Initialize weekDays and monthDays
  useEffect(() => {
    if (currentView === 'day') {
      setWeekDays([currentDate]);
    } else if (currentView === 'week') {
      setWeekDays(generateWeekDays(currentDate));
    } else if (currentView === 'month') {
      setMonthDays(generateMonthDays(currentDate));
    }
  }, [currentDate, currentView, generateWeekDays, generateMonthDays]);

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.start), day));
  };

  // Get events for a specific day and hour
  const getEventsForTimeSlot = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day) && eventDate.getHours() === hour;
    });
  };

  // Navigation functions
  const goToPrevious = () => {
    if (currentView === 'day') {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (currentView === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else if (currentView === 'month') {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const goToNext = () => {
    if (currentView === 'day') {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (currentView === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else if (currentView === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Change view
  const changeView = (view: CalendarView) => {
    // On mobile, don't allow changing to week view
    if (isMobile && view === 'week') {
      return;
    }
    setCurrentView(view);
  };

  // Safe format function
  const safeFormat = (date: Date | undefined, formatString: string) => {
    if (!date) return '';
    return format(date, formatString);
  };

  // Get title based on current view
  const getTitle = () => {
    if (currentView === 'day') {
      return safeFormat(currentDate, 'EEEE, MMMM d, yyyy');
    } else if (currentView === 'week' && weekDays.length >= 7) {
      return `${safeFormat(weekDays[0], 'MMM d')} - ${safeFormat(weekDays[6], 'MMM d, yyyy')}`;
    } else if (currentView === 'month') {
      return safeFormat(currentDate, 'MMMM yyyy');
    }
    return '';
  };

  // Updated event click handler
  const handleEventClick = (event: CalendarEvent) => {
    // Don't process clicks for completed or cancelled events
    if (event.status.name.toLowerCase() === 'completed' || event.status.name.toLowerCase() === 'cancelled') {
      return;
    }
    setSelectedEvent(event);
    onEventClick(event);
  };

  // Update the getStatusStyles function
  const getStatusStyles = (status: string) => {
    const isDisabled = status.toLowerCase() === 'completed' || status.toLowerCase() === 'cancelled';
    const baseStyles = isDisabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-opacity-90';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return `border-l-4 border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100 ${baseStyles}`;
      case 'completed':
        return `border-l-4 border-l-green-500 bg-green-50 ${baseStyles}`;
      case 'cancelled':
        return `border-l-4 border-l-red-500 bg-red-50 ${baseStyles}`;
      case 'confirmed':
        return `border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100 ${baseStyles}`;
      default:
        return `border-l-4 border-l-gray-500 bg-gray-50 ${baseStyles}`;
    }
  };

  // Updated renderDayView with current time indicator
  const renderDayView = () => {
    // Calculate current time position
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const timePercentage = (currentMinute / 60) * 100;
    const isCurrentTimeInRange = currentHour >= 8 && currentHour <= 20;
    const showTimeIndicator = isSameDay(currentDate, now) && isCurrentTimeInRange;

    return (
      <div className="day-view relative">
        <div className="time-grid">
          {displayHours.map((timeDisplay, hourIndex) => {
            const hour = hourIndex + 8; // Starting at 8 AM
            const eventsInSlot = getEventsForTimeSlot(currentDate, hour);

            // Helper function to create date with specific hour
            const createDateTimeForHour = () => {
              const selectedDateTime = new Date(currentDate);
              selectedDateTime.setHours(hour, 0, 0, 0);
              return selectedDateTime;
            };

            return (
              <div key={hourIndex} className="grid grid-cols-[60px_1fr] border-b border-gray-100 relative">
                <div
                  className="time-label flex h-full text-xs font-semibold text-gray-400 cursor-pointer"
                  onClick={() => {
                    // Create new date object for the selected time slot
                    const selectedDateTime = createDateTimeForHour();

                    // Open the booking form with the selected date/time
                    setShowAddBooking(true);
                    // Store the selected date/time (for passing to overlay)
                    setSelectedTimeSlot(selectedDateTime);
                  }}
                >
                  {timeDisplay}
                </div>
                <div
                  className="time-slot p-1 min-h-20 flex flex-col gap-1 relative hover:bg-gray-50/50"
                  onClick={() => {
                    // Create new date object for the selected time slot
                    const selectedDateTime = createDateTimeForHour();

                    // Open the booking form with the selected date/time
                    setShowAddBooking(true);
                    // Store the selected date/time (for passing to overlay)
                    setSelectedTimeSlot(selectedDateTime);
                  }}
                >
                  {/* Current time indicator - updated with z-index */}
                  {showTimeIndicator && currentHour === hour && (
                    <div
                      className="absolute left-0 right-0 z-0 pointer-events-none"
                      style={{ top: `${timePercentage}%` }}
                    >
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-md"></div>
                        <div className="h-0.5 bg-red-500 w-full"></div>
                      </div>
                    </div>
                  )}

                  {eventsInSlot.map(event => (
                    <div
                      key={event.id}
                      className={`event-chip px-3 py-1.5 rounded shadow-sm cursor-pointer overflow-hidden flex flex-col gap-0.5 transition-all ${getStatusStyles(event.status.name)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {event.service.name}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600 gap-2">
                        <span>{format(new Date(event.start), 'h:mm a')}</span>
                        <span>•</span>
                        <span className="truncate">{event.customer.name}</span>
                        <span className="ml-auto font-medium" style={{
                          color: event.status.name.toLowerCase() === 'pending' ? '#D97706' :
                            event.status.name.toLowerCase() === 'confirmed' ? '#2563EB' :
                            event.status.name.toLowerCase() === 'completed' ? '#059669' :
                            '#DC2626'
                        }}>
                          {event.status.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view with modern mobile-friendly design
  const renderWeekView = () => {
    return (
      <div className="week-view">
        <div className="grid grid-cols-[60px_1fr] mb-2">
          <div className="time-gutter"></div>
          <div className="grid grid-cols-7">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="day-header p-2 text-center font-medium"
                onClick={() => {
                  if (isMobile) {
                    setCurrentDate(day);
                    setCurrentView('list');
                  }
                }}
              >
                <div className="text-xs sm:text-sm whitespace-nowrap text-gray-500 font-medium mb-1">
                  {format(day, isMobile ? 'E' : 'EEE')}
                </div>
                <div className={`mx-auto ${isSameDay(day, new Date()) ? 'bg-black text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shadow-md' : 'text-base sm:text-lg'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="time-grid">
          {displayHours.map((timeDisplay, hourIndex) => {
            const hour = hourIndex + 8; // Starting at 8 AM

            return (
              <div key={hourIndex} className="grid grid-cols-[60px_1fr] border-b border-gray-100">
                <div className="time-label flex h-full text-xs font-semibold text-gray-400">
                  {timeDisplay}
                </div>
                <div className="grid grid-cols-7">
                  {weekDays.map((day, dayIndex) => {
                    const eventsInSlot = getEventsForTimeSlot(day, hour);

                    return (
                      <div
                        key={dayIndex}
                        className={`time-slot p-1 min-h-20 flex flex-col gap-1 relative ${
                          isSameDay(day, new Date()) ? 'bg-blue-50/30' : ''
                        } border-l border-gray-100`}
                        onClick={() => {
                          if (isMobile) {
                            setCurrentDate(day);
                            setCurrentView('list');
                          }
                        }}
                      >
                        {isMobile ? (
                          // Mobile: Show count with status-based colors
                          eventsInSlot.length > 0 && (
                            <div className="event-count bg-gray-100 text-xs font-medium rounded-lg px-2 py-1 text-center">
                              {eventsInSlot.length} events
                            </div>
                          )
                        ) : (
                          // Desktop: Updated event display
                          eventsInSlot.map(event => (
                            <div
                              key={event.id}
                              className={`event-chip px-2 py-1 rounded shadow-sm cursor-pointer overflow-hidden transition-all ${getStatusStyles(event.status.name)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              <div className="text-xs font-medium truncate">
                                {event.service.name}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {event.customer.name}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render month view with modern mobile-friendly design
  const renderMonthView = () => {
    if (monthDays.length === 0) return null;

    return (
      <div className="month-view p-2 sm:p-4 h-full flex flex-col">
        <div className="grid grid-cols-7 text-center font-medium mb-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={index} className="p-1 sm:p-2 text-sm text-gray-500">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 flex-grow">
          {monthDays.flat().map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={index}
                className={`day-cell p-1 flex flex-col min-h-[100px] ${
                  isCurrentMonth ? '' : 'bg-gray-50'
                } ${isToday ? 'ring-1 ring-blue-500' : 'border border-gray-100'}`}
              >
                <div className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="flex-grow overflow-y-auto space-y-1 mt-1">
                  {dayEvents.map((event, idx) => 
                    idx < 3 ? (
                      <div
                        key={event.id}
                        className={`px-2 py-1 text-xs rounded cursor-pointer ${getStatusStyles(event.status.name)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <div className="font-medium truncate">
                          {format(new Date(event.start), 'h:mm a')} {event.service.name}
                        </div>
                      </div>
                    ) : idx === 3 ? (
                      <div key="more" className="text-xs text-gray-500 px-2">
                        + {dayEvents.length - 3} more
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* <div className="custom-calendar bg-white rounded-xl shadow-sm flex flex-col h-full min-h-[70vh]">*/}
      {!selectedEvent && !showAddBooking ? (
        <SimpleSideBar>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            {/* Calendar Header - Modernized design */}
            <div className="calendar-header flex flex-col sticky top-0 bg-white z-20 rounded-t-xl">
              {/* View switcher with responsive padding */}
              <div className="view-switcher flex justify-between items-center px-4 py-4 sm:px-5 sm:py-5">
                {/* View buttons with modern style */}
                <div className="flex space-x-2 sm:space-x-3 items-center">
                  {/* Notification Bell - Clear on click outside */}
                  <div className="dropdown">
                    <div 
                      tabIndex={0} 
                      role="button" 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all shadow-sm relative mr-1 sm:mr-2 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      {notifications && notifications.length > 0 && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full shadow-md"></span>
                      )}
                    </div>

                    <ul 
                      tabIndex={0} 
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 sm:w-96 p-2 shadow-lg mt-4"
                      onBlur={(e) => {
                        // Check if the related target is outside the dropdown
                        if (!e.currentTarget.contains(e.relatedTarget as Node) && notifications?.length > 0) {
                          notifications.forEach(notification => removeNotification(notification.id));
                        }
                      }}
                    >
                      <div className="p-2">
                        <h3 className="text-sm font-semibold text-black mb-4">Notifications</h3>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                          {notifications && notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="flex items-start p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group"
                              >
                                <div className="flex-1">
                                  <p className="text-sm text-black">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </ul>
                  </div>

                  <button
                    className={`w-20 sm:w-28 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${currentView === 'day' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    onClick={() => changeView('day')}
                  >
                    Today
                  </button>
                  {/* Only show week view button on desktop */}
                  {!isMobile && (
                    <button
                      className={`w-20 sm:w-28 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${currentView === 'week' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                      onClick={() => changeView('week')}
                    >
                      Week
                    </button>
                  )}
                  <button
                    className={`w-20 sm:w-28 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${currentView === 'month' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    onClick={() => changeView('month')}
                  >
                    {isMobile ? 'Calendar' : 'Month'}
                  </button>
                </div>

                {/* Add booking button with modern style */}
                <button
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md transition-all ${showAddBooking ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  onClick={() => setShowAddBooking(true)}
                >
                  <span className="text-lg sm:text-xl font-bold">+</span>
                </button>
              </div>

              {/* Date navigation - Modern style */}
              <div className="flex justify-center items-center py-3 px-3 sm:py-4 sm:px-5 bg-gray-50/50 rounded-xl mx-3 mb-3">
                <div className="flex items-center space-x-4 sm:space-x-8">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm"
                    onClick={goToPrevious}
                    aria-label="Previous"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  {/* Minimalist date display with stacked layout */}
                  <div className="flex flex-col items-center">
                    {currentView === 'day' ? (
                      /* Day view - show day with big date */
                      <>
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
                          {format(currentDate, 'EEEE')}
                        </div>
                        <div className="text-lg sm:text-3xl font-bold">
                          {format(currentDate, 'd')}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {format(currentDate, 'MMMM yyyy')}
                        </div>
                      </>
                    ) : currentView === 'week' ? (
                      /* Week view - show week range */
                      <>
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
                          Week
                        </div>
                        <div className="text-lg sm:text-3xl font-bold whitespace-nowrap">
                          {safeFormat(weekDays[0], 'd')} - {safeFormat(weekDays[6], 'd')}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {safeFormat(weekDays[0], 'MMM')} {weekDays[0]?.getFullYear() !== weekDays[6]?.getFullYear() ? safeFormat(weekDays[0], 'yyyy') : ''}
                          {weekDays[0]?.getMonth() !== weekDays[6]?.getMonth() ? ` - ${safeFormat(weekDays[6], 'MMM')}` : ''}
                          {safeFormat(weekDays[6], 'yyyy')}
                        </div>
                      </>
                    ) : (
                      /* Month view - show month and year */
                      <>
                        <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">
                          {format(currentDate, 'yyyy')}
                        </div>
                        <div className="text-lg sm:text-3xl font-bold">
                          {format(currentDate, 'MMMM')}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm"
                    onClick={goToNext}
                    aria-label="Next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Content */}
            <div className="calendar-content overflow-auto flex-grow px-2 relative pb-4 md:pb-0">
              {currentView === 'day' && renderDayView()}
              {currentView === 'week' && renderWeekView()}
              {currentView === 'month' && renderMonthView()}
            </div>
          </motion.div>
        </SimpleSideBar>
      ) : null}

      {/* Booking Overlay */}
      {selectedEvent && (
        <BookingOverlay
          booking={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Add Booking Overlay */}
      {showAddBooking && (
        <AddBookingOverlay
          onClose={() => setShowAddBooking(false)}
          selectedDate={selectedTimeSlot || currentDate}
        />
      )}
    </div>
  );
};

export default CustomCalendar; 