'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import BookingOverlay from './bookingOverlay';
import CustomCalendar from './CustomCalendar';

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

const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
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
        // Mock data - replace with actual API call
        const fetchBookings = async () => {
            setIsLoading(true);
            try {
                // This would be your actual data fetching logic
                // const response = await fetch('/api/bookings');
                // const data = await response.json();

                // Mock data for demonstration
                const mockBookings: Booking[] = [
                    {
                        id: '1',
                        clientName: 'John Smith',
                        service: 'Haircut',
                        phoneNumber: '(555) 123-4567',
                        dateTime: new Date(new Date().setHours(9, 0, 0, 0))
                    },
                    {
                        id: '2',
                        clientName: 'Sarah Johnson',
                        service: 'Color Treatment',
                        phoneNumber: '(555) 234-5678',
                        dateTime: new Date(new Date().setHours(10, 30, 0, 0))
                    },
                    {
                        id: '3',
                        clientName: 'Michael Brown',
                        service: 'Beard Trim',
                        phoneNumber: '(555) 345-6789',
                        dateTime: new Date(new Date().setHours(11, 15, 0, 0))
                    },
                    {
                        id: '4',
                        clientName: 'Emily Davis',
                        service: 'Full Styling',
                        phoneNumber: '(555) 456-7890',
                        dateTime: new Date(new Date().setHours(13, 0, 0, 0))
                    },
                    {
                        id: '5',
                        clientName: 'Robert Wilson',
                        service: 'Shave',
                        phoneNumber: '(555) 567-8901',
                        dateTime: new Date(new Date().setHours(14, 30, 0, 0))
                    },
                    {
                        id: '6',
                        clientName: 'John Smith',
                        service: 'Haircut',
                        phoneNumber: '(555) 123-4567',
                        dateTime: new Date(new Date().setHours(14, 30, 0, 0))
                    },
                    {
                        id: '7',
                        clientName: 'Sarah Johnson',
                        service: 'Color Treatment',
                        phoneNumber: '(555) 234-5678',
                        dateTime: new Date(new Date().setHours(14, 30, 0, 0))
                    },
                    {
                        id: '8',
                        clientName: 'Michael Brown',
                        service: 'Beard Trim',
                        phoneNumber: '(555) 345-6789',
                        dateTime: new Date(new Date().setHours(14, 30, 0, 0))
                    },
                    {
                        id: '9',
                        clientName: 'Emily Davis',
                        service: 'Full Styling',
                        phoneNumber: '(555) 456-7890',
                        dateTime: new Date(new Date().setHours(14, 30, 0, 0))
                    },
                    {
                        id: '10',
                        clientName: 'Robert Wilson',
                        service: 'Shave',
                        phoneNumber: '(555) 567-8901',
                        dateTime: new Date(new Date().setHours(14, 30, 0, 0))
                    }
                ];

                setBookings(mockBookings);

                // Convert bookings to calendar events
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
                console.error('Error fetching bookings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [selectedDate]);

    const handleEventClick = (info: any) => {
        setSelectedEvent(info.event);
        setSelectedBooking({
            id: info.event.id,
            clientName: info.event.extendedProps.clientName,
            service: info.event.extendedProps.service,
            phoneNumber: info.event.extendedProps.phoneNumber,
            dateTime: info.event.start
        });
        setShowOverlay(true);
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <div className="event-content">
                <div className="event-title">{eventInfo.event.title}</div>
            </div>
        );
    };

    // Filter bookings for the selected date
    const filteredBookings = bookings.filter(booking =>
        booking.dateTime.toDateString() === selectedDate.toDateString()
    ).sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(e.target.value));
    };

    const handleBookingClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowOverlay(true);
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        setSelectedBooking(null);
        setSelectedEvent(null);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'list' ? 'calendar' : 'list');
    };

    return (
        <div >
                <CustomCalendar
                    events={events}
                    onEventClick={(event) => {
                        const booking: Booking = {
                            id: event.id,
                            clientName: event.extendedProps.clientName,
                            service: event.extendedProps.service,
                            phoneNumber: event.extendedProps.phoneNumber,
                            dateTime: event.start
                        };
                        setSelectedBooking(booking);
                        setShowOverlay(true);
                    }}
                />
        </div>
    );
};

export default BookingList;
