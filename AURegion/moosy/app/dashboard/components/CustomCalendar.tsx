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
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: {
    clientName: string;
    service: string;
    phoneNumber: string;
  };
}

interface CustomCalendarProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

type CalendarView = 'day' | 'week' | 'month' | 'list';

const CustomCalendar: React.FC<CustomCalendarProps> = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('week');
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [monthDays, setMonthDays] = useState<Date[][]>([]);
  const [displayHours, setDisplayHours] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddBooking, setShowAddBooking] = useState(false);
  
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
    setSelectedEvent(event);
    onEventClick(event);
  };

  // Updated event chip styles to be simpler and more monochromatic
  const renderDayView = () => {
    return (
      <div className="day-view">
        <div className="time-grid">
          {displayHours.map((timeDisplay, hourIndex) => {
            const hour = hourIndex + 8; // Starting at 8 AM
            const eventsInSlot = getEventsForTimeSlot(currentDate, hour);
            
            return (
              <div key={hourIndex} className="grid grid-cols-[80px_1fr] border-b border-gray-200">
                <div className="time-label flex items-center justify-center h-full text-xs text-gray-500">
                  {timeDisplay}
                </div>
                <div className="time-slot p-1 border-l border-gray-200 min-h-16 flex flex-col gap-1 relative">
                  {eventsInSlot.map(event => (
                    <div
                      key={event.id}
                      className="event-chip bg-black text-white p-1.5 text-xs rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0 hover:bg-gray-800 transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
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

  // Render week view with updated styles
  const renderWeekView = () => {
    return (
      <div className="week-view">
        <div className="grid grid-cols-[80px_1fr] border-b border-gray-200">
          <div className="time-gutter"></div>
          <div className="grid grid-cols-7">
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className="day-header p-2 text-center border-l border-gray-200 font-medium"
                onClick={() => {
                  if (isMobile) {
                    setCurrentDate(day);
                    setCurrentView('list');
                  }
                }}
              >
                <div className="text-xs sm:text-sm whitespace-nowrap text-gray-600">
                  {format(day, isMobile ? 'E' : 'EEE')}
                </div>
                <div className={`text-base sm:text-lg ${isSameDay(day, new Date()) ? 'bg-black text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto' : ''}`}>
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
              <div key={hourIndex} className="grid grid-cols-[80px_1fr] border-b border-gray-200">
                <div className="time-label flex items-center justify-center h-full text-xs text-gray-500">
                  {timeDisplay}
                </div>
                <div className="grid grid-cols-7">
                  {weekDays.map((day, dayIndex) => {
                    const eventsInSlot = getEventsForTimeSlot(day, hour);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`time-slot p-1 border-l border-gray-200 min-h-16 flex flex-col gap-1 relative ${isSameDay(day, new Date()) ? 'bg-gray-50' : ''}`}
                        onClick={() => {
                          if (isMobile) {
                            setCurrentDate(day);
                            setCurrentView('list');
                          }
                        }}
                      >
                        {isMobile ? (
                          // Mobile: Just show the count
                          eventsInSlot.length > 0 && (
                            <div 
                              className="event-count bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center mx-auto cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentDate(day);
                                setCurrentView('list');
                              }}
                            >
                              {eventsInSlot.length}
                            </div>
                          )
                        ) : (
                          // Desktop: Show event details
                          eventsInSlot.map(event => (
                            <div
                              key={event.id}
                              className="event-chip bg-black text-white p-1.5 text-xs rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0 hover:bg-gray-800 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                            >
                              {event.title}
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

  // Render month view with updated styles
  const renderMonthView = () => {
    if (monthDays.length === 0) return null;
    
    return (
      <div className="month-view p-1 sm:p-4 h-full flex flex-col">
        <div className="grid grid-cols-7 text-center font-medium border-b border-gray-200">
          <div className="p-1 sm:p-2 text-sm sm:text-base text-gray-600">Mon</div>
          <div className="p-1 sm:p-2 text-sm sm:text-base text-gray-600">Tue</div>
          <div className="p-1 sm:p-2 text-sm sm:text-base text-gray-600">Wed</div>
          <div className="p-1 sm:p-2 text-sm sm:text-base text-gray-600">Thu</div>
          <div className="p-1 sm:p-2 text-sm sm:text-base text-gray-600">Fri</div>
          <div className="p-1 sm:p-2 text-sm sm:text-base text-gray-600">Sat</div>
          <div className="p-1 sm:p-2 text-sm sm:text-base text-gray-600">Sun</div>
        </div>
        
        <div className="grid grid-cols-7 flex-grow min-h-[70vh]">
          {monthDays.flat().map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayEvents = getEventsForDay(day);
            
            return (
              <div 
                key={index} 
                className={`day-cell border border-gray-200 p-1 flex flex-col overflow-hidden ${isCurrentMonth ? '' : 'bg-gray-50 text-gray-400'} ${isToday ? 'bg-gray-50' : ''}`}
                onClick={() => {
                  if (isMobile) {
                    setCurrentDate(day);
                    setCurrentView('day');
                  }
                }}
              >
                <div className="flex justify-center mb-1 flex-shrink-0">
                  <span className={`inline-flex items-center justify-center w-6 h-6 text-sm sm:text-base ${isToday ? 'bg-black text-white rounded-full' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                {dayEvents.length > 0 && (
                  isMobile ? (
                    // Mobile: Only show event count
                    <div className="flex justify-center mt-auto mb-1">
                      <div 
                        className="event-count bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentDate(day);
                          setCurrentView('day');
                        }}
                      >
                        {dayEvents.length}
                      </div>
                    </div>
                  ) : (
                    // Desktop: Show event previews with flexible layout
                    <div className="flex-grow overflow-y-auto">
                      {dayEvents.map((event, idx) => (
                        idx < 3 ? (
                          <div
                            key={event.id}
                            className="event-chip bg-black text-white p-1 mb-1 text-xs rounded cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:bg-gray-800 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            {format(new Date(event.start), 'h:mm a')} {event.title}
                          </div>
                        ) : (idx === 3 ? (
                          <div key="more" className="text-xs text-gray-500 pl-1">
                            +{dayEvents.length - 3} more
                          </div>
                        ) : null)
                      ))}
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="custom-calendar bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full min-h-[70vh]">
      {/* Calendar Header - Simplified for black and white theme */}
      <div className="calendar-header flex flex-col border-b border-gray-200 sticky top-0 bg-white z-10">
        {/* View switcher with responsive padding */}
        <div className="view-switcher flex justify-between items-center px-3 py-3 sm:px-4 sm:py-3">
          {/* View buttons with simplified monochrome style */}
          <div className="flex space-x-2 sm:space-x-3">
            <button 
              className={`w-20 sm:w-28 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${currentView === 'day' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              onClick={() => changeView('day')}
            >
              Day
            </button>
            {/* Only show week view button on desktop */}
            {!isMobile && (
              <button 
                className={`w-20 sm:w-28 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${currentView === 'week' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                onClick={() => changeView('week')}
              >
                Week
              </button>
            )}
            <button 
              className={`w-20 sm:w-28 h-10 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors ${currentView === 'month' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              onClick={() => changeView('month')}
            >
              Month
            </button>
          </div>
          
          {/* Add booking button with simplified style */}
          <button 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center shadow-sm hover:bg-gray-800 transition-colors"
            onClick={() => setShowAddBooking(true)}
          >
            <span className="text-lg sm:text-xl font-bold">+</span>
          </button>
        </div>
        
        {/* Date navigation - Clean black and white style */}
        <div className="flex justify-center items-center py-2 px-2 sm:py-3 sm:px-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
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
                  <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                    {format(currentDate, 'EEEE')}
                  </div>
                  <div className="text-lg sm:text-2xl font-bold">
                    {format(currentDate, 'd')}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {format(currentDate, 'MMMM yyyy')}
                  </div>
                </>
              ) : currentView === 'week' ? (
                /* Week view - show week range */
                <>
                  <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                    Week
                  </div>
                  <div className="text-lg sm:text-2xl font-bold whitespace-nowrap">
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
                  <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                    {format(currentDate, 'yyyy')}
                  </div>
                  <div className="text-lg sm:text-2xl font-bold">
                    {format(currentDate, 'MMMM')}
                  </div>
                </>
              )}
            </div>
            
            <button 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
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
      <div className="calendar-content overflow-auto flex-grow">
        {currentView === 'day' && renderDayView()}
        {currentView === 'week' && renderWeekView()}
        {currentView === 'month' && renderMonthView()}
      </div>
      
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
          // selectedDate={currentDate}
        />
      )}
    </div>
  );
};

export default CustomCalendar; 