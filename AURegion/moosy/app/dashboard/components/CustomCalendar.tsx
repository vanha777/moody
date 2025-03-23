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

  // Updated event chip styles with modern mobile-friendly design
  const renderDayView = () => {
    return (
      <div className="day-view">
        <div className="time-grid">
          {displayHours.map((timeDisplay, hourIndex) => {
            const hour = hourIndex + 8; // Starting at 8 AM
            const eventsInSlot = getEventsForTimeSlot(currentDate, hour);
            
            return (
              <div key={hourIndex} className="grid grid-cols-[60px_1fr] border-b border-gray-50">
                <div className="time-label flex items-center justify-center h-full text-xs font-semibold text-gray-500">
                  {timeDisplay}
                </div>
                <div className="time-slot p-2 min-h-20 flex flex-col gap-2 relative hover:bg-gray-50/50 transition-all duration-200">
                  {eventsInSlot.map(event => (
                    <div
                      key={event.id}
                      className="event-chip bg-black/90 text-white px-4 py-2.5 text-sm font-medium rounded-xl shadow-md cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0 hover:bg-black hover:scale-[1.01] transition-all"
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
              <div key={hourIndex} className="grid grid-cols-[60px_1fr] border-b border-gray-50">
                <div className="time-label flex items-center justify-center h-full text-xs font-semibold text-gray-500">
                  {timeDisplay}
                </div>
                <div className="grid grid-cols-7">
                  {weekDays.map((day, dayIndex) => {
                    const eventsInSlot = getEventsForTimeSlot(day, hour);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`time-slot p-2 min-h-20 flex flex-col gap-2 relative ${isSameDay(day, new Date()) ? 'bg-gray-50/70' : 'hover:bg-gray-50/30'} transition-all duration-200`}
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
                              className="event-count bg-black text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center mx-auto cursor-pointer shadow-md"
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
                              className="event-chip bg-black/90 text-white px-4 py-2.5 text-sm font-medium rounded-xl shadow-md cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0 hover:bg-black hover:scale-[1.01] transition-all"
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
        
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 flex-grow min-h-[70vh]">
          {monthDays.flat().map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const dayEvents = getEventsForDay(day);
            
            return (
              <div 
                key={index} 
                className={`day-cell rounded-2xl p-1.5 sm:p-2.5 flex flex-col overflow-hidden transition-all duration-200 hover:bg-gray-50/70 ${isCurrentMonth ? '' : 'bg-gray-50/30 text-gray-400'} ${isToday ? 'ring-1 ring-black/20 shadow-sm' : ''}`}
                onClick={() => {
                  if (isMobile) {
                    setCurrentDate(day);
                    setCurrentView('day');
                  }
                }}
              >
                <div className="flex justify-end mb-2 flex-shrink-0">
                  <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-sm font-medium ${isToday ? 'bg-black text-white rounded-full shadow-md' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                {dayEvents.length > 0 && (
                  isMobile ? (
                    // Mobile: Only show event count
                    <div className="flex justify-end mt-auto mb-1">
                      <div 
                        className="event-count bg-black text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md"
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
                    <div className="flex-grow overflow-y-auto space-y-1.5">
                      {dayEvents.map((event, idx) => (
                        idx < 2 ? (
                          <div
                            key={event.id}
                            className="event-chip bg-black/90 text-white p-2 text-xs rounded-xl cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap hover:bg-black transition-all shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            {format(new Date(event.start), 'h:mm')} {event.title}
                          </div>
                        ) : (idx === 2 ? (
                          <div key="more" className="text-xs font-medium text-black/70 pl-1.5 flex items-center">
                            <span className="bg-black/10 rounded-full w-5 h-5 flex items-center justify-center mr-1 text-black/70">+</span>
                            <span>{dayEvents.length - 2} more</span>
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
    <div className="custom-calendar bg-white rounded-xl shadow-sm flex flex-col h-full min-h-[70vh]">
      {/* Calendar Header - Modernized design */}
      <div className="calendar-header flex flex-col sticky top-0 bg-white z-10 rounded-t-xl">
        {/* View switcher with responsive padding */}
        <div className="view-switcher flex justify-between items-center px-4 py-4 sm:px-5 sm:py-5">
          {/* View buttons with modern style */}
          <div className="flex space-x-2 sm:space-x-3">
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
      <div className="calendar-content overflow-auto flex-grow px-2">
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