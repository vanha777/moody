"use client";

import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

interface Booking {
  id: string;
  clientName: string;
  service: string;
  phoneNumber: string;
  dateTime: Date;
}

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

const Calendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentView, setCurrentView] = useState("timeGridWeek");

  const updateCalendarView = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setCurrentView("timeGridDay");
    } else if (width < 1024) {
      setCurrentView("timeGridWeek");
    } else {
      setCurrentView("timeGridWeek");
    }
  };

  useEffect(() => {
    updateCalendarView();
    window.addEventListener("resize", updateCalendarView);
    return () => window.removeEventListener("resize", updateCalendarView);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(currentView);
    }
  }, [currentView]);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const mockBookings: Booking[] = [
          {
            id: "1",
            clientName: "John Smith",
            service: "Haircut",
            phoneNumber: "(555) 123-4567",
            dateTime: new Date(new Date().setHours(9, 0, 0, 0)),
          },
          {
            id: "2",
            clientName: "Sarah Johnson",
            service: "Color Treatment",
            phoneNumber: "(555) 234-5678",
            dateTime: new Date(new Date().setHours(10, 30, 0, 0)),
          },
          {
            id: "3",
            clientName: "Michael Brown",
            service: "Beard Trim",
            phoneNumber: "(555) 345-6789",
            dateTime: new Date(new Date().setHours(11, 15, 0, 0)),
          },
          {
            id: "4",
            clientName: "Emily Davis",
            service: "Full Styling",
            phoneNumber: "(555) 456-7890",
            dateTime: new Date(new Date().setHours(13, 0, 0, 0)),
          },
          {
            id: "5",
            clientName: "Robert Wilson",
            service: "Shave",
            phoneNumber: "(555) 567-8901",
            dateTime: new Date(new Date().setHours(14, 30, 0, 0)),
          },
        ];

        setBookings(mockBookings);

        const calendarEvents = mockBookings.map((booking) => {
          const startTime = new Date(booking.dateTime);
          const endTime = new Date(booking.dateTime);
          endTime.setMinutes(endTime.getMinutes() + 60);

          return {
            id: booking.id,
            title: `${booking.clientName} - ${booking.service}`,
            start: startTime,
            end: endTime,
            extendedProps: {
              clientName: booking.clientName,
              service: booking.service,
              phoneNumber: booking.phoneNumber,
            },
          };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 p-6 pb-2">Booking Calendar</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="calendar-container">
          <div className="p-2 sm:p-4 lg:p-6">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={currentView}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              events={events}
              eventClick={handleEventClick}
              height="auto"
              nowIndicator={true}
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              expandRows={true}
              stickyHeaderDates={true}
              dayMaxEvents={true}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                meridiem: "short",
              }}
              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5, 6],
                startTime: "08:00",
                endTime: "20:00",
              }}
              longPressDelay={500}
              eventLongPressDelay={500}
              selectLongPressDelay={500}
            />
          </div>

          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
                <div className="mb-2">
                  <strong>Client:</strong> {selectedEvent.extendedProps.clientName}
                </div>
                <div className="mb-2">
                  <strong>Service:</strong> {selectedEvent.extendedProps.service}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {selectedEvent.extendedProps.phoneNumber}
                </div>
                <div className="mb-2">
                  <strong>Time:</strong> {format(selectedEvent.start, "h:mm a")} -{" "}
                  {format(selectedEvent.end, "h:mm a")}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={closeEventDetails}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style jsx global>{`
        .calendar-container {
          width: 100%;
          overflow-x: auto;
        }

        .fc-toolbar.fc-header-toolbar {
          flex-direction: column;
          gap: 0.75rem;
          padding: 0.5rem;
        }

        .fc-button {
          background-color: #3b82f6; /* Tailwind blue-500 */
          border: none;
          color: white;
        }

        .fc-button:hover {
          background-color: #2563eb; /* Tailwind blue-600 */
        }

        .fc-button.fc-button-active {
          background-color: #1d4ed8; /* Tailwind blue-700 */
        }

        @media (min-width: 768px) {
          .fc-toolbar.fc-header-toolbar {
            flex-direction: row;
            gap: 1rem;
            padding: 1rem;
          }
        }

        .fc-view-harness {
          min-height: 400px;
        }

        .fc-scrollgrid-sync-inner {
          min-width: 60px;
        }

        .fc-event {
          cursor: pointer;
          font-size: 0.875rem;
          background-color: #3b82f6; /* Blue events */
          border: none;
          color: white;
        }

        @media (max-width: 640px) {
          .fc-header-toolbar .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            width: 100%;
            margin-bottom: 0.5rem;
          }

          .fc-header-toolbar .fc-toolbar-title {
            font-size: 1.125rem;
            text-align: center;
          }

          .fc-header-toolbar .fc-button {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }

          .fc-timegrid-slot-label {
            font-size: 0.75rem;
          }

          .fc-event {
            font-size: 0.75rem;
          }

          .fc-col-header-cell {
            font-size: 0.875rem;
          }
        }

        @media (min-width: 640px) and (max-width: 1024px) {
          .fc-header-toolbar .fc-button {
            font-size: 0.875rem;
          }

          .fc-timegrid-slot-label {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;