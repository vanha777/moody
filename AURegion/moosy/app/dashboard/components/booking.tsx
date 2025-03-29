'use client';

import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import BookingOverlay from './bookingOverlay';
import CustomCalendar from './CustomCalendar';
import { ContactProps } from '@/app/business/clients/components/businesses';
import { ServiceData } from '@/app/business/checkout/components/service';
import { useAppContext } from '@/app/utils/AppContext';
import { useRouter } from 'next/navigation';
export interface CalendarEvent {
    id: string;
    service: ServiceData
    notes: string;
    start: Date;
    end: Date;
    customer: ContactProps
}

const BookingList: React.FC = () => {
    const { auth } = useAppContext();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
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
        if (!auth) {
            router.push("/");
        }
        updateCalendarView();
        window.addEventListener("resize", updateCalendarView);
        return () => window.removeEventListener("resize", updateCalendarView);
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                // Mock data for demonstration
                console.log("this is the shit", auth?.bookings);
                const mockEvents: CalendarEvent[] = [
                    {
                        id: '1',
                        service: {
                            id: '101',
                            name: 'Haircut',
                            description: 'Basic haircut service',
                            price: 100,
                            duration: '1 hour',
                            category: 'Hair'
                        },
                        notes: 'This is a note',
                        start: new Date(new Date().setHours(9, 0, 0, 0)),
                        end: new Date(new Date().setHours(10, 0, 0, 0)),
                        customer: {
                            id: 123,
                            name: 'John Smith',
                            email: 'john.smith@example.com',
                            phone: '(555) 123-4567',
                            company: 'ABC Company',
                            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                            lastContacted: '2023-05-15',
                            notes: 'Regular client, prefers appointments in the morning'
                        }
                    },
                    {
                        id: '2',
                        service: {
                            id: '456',
                            name: 'Color Treatment',
                            description: 'Full color treatment service',
                            price: 150,
                            duration: '2 hours',
                            category: 'Color'
                        },
                        notes: 'This is a note',
                        start: new Date(new Date().setHours(11, 0, 0, 0)),
                        end: new Date(new Date().setHours(13, 0, 0, 0)),
                        customer: {
                            id: 456,
                            name: 'Emily Johnson',
                            email: 'emily.johnson@example.com',
                            phone: '(555) 234-5678',
                            avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
                        }
                    },
                    {
                        id: '3',
                        service: {
                            id: '789',
                            name: 'Beard Trim',
                            description: 'Beard trimming and shaping',
                            price: 200,
                            duration: '30 minutes',
                            category: 'Grooming'
                        },
                        notes: 'This is a note',
                        start: new Date(new Date().setHours(14, 0, 0, 0)),
                        end: new Date(new Date().setHours(14, 30, 0, 0)),
                        customer: {
                            id: 789,
                            name: 'Michael Brown',
                            email: 'michael.brown@example.com',
                            phone: '(555) 345-6789',
                            avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
                        }
                    },
                    {
                        id: '4',
                        service: {
                            id: '101',
                            name: 'Full Highlights',
                            description: 'Complete hair highlighting service',
                            price: 250,
                            duration: '2 hours',
                            category: 'Color'
                        },
                        notes: 'This is a note',
                        start: new Date(new Date().setHours(15, 0, 0, 0)),
                        end: new Date(new Date().setHours(17, 0, 0, 0)),
                        customer: {
                            id: 101,
                            name: 'Sarah Davis',
                            email: 'sarah.davis@example.com',
                            phone: '(555) 456-7890',
                            avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
                        }
                    },
                    {
                        id: '5',
                        service: {
                            id: '102',
                            name: 'Haircut & Style',
                            description: 'Haircut with styling service',
                            price: 120,
                            duration: '1 hour',
                            category: 'Hair'
                        },
                        notes: 'This is a note',
                        start: new Date(new Date().setHours(9, 0, 0, 0)),
                        end: new Date(new Date().setHours(10, 0, 0, 0)),
                        customer: {
                            id: 102,
                            name: 'Robert Wilson',
                            email: 'robert.wilson@example.com',
                            phone: '(555) 567-8901',
                            avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
                        }
                    },
                    {
                        id: '6',
                        service: {
                            id: '103',
                            name: 'Blowout',
                            description: 'Hair blowout and styling',
                            price: 130,
                            duration: '1 hour',
                            category: 'Styling'
                        },
                        notes: 'This is a note',
                        start: new Date(new Date().setHours(11, 30, 0, 0)),
                        end: new Date(new Date().setHours(12, 30, 0, 0)),
                        customer: {
                            id: 103,
                            name: 'Jennifer Lee',
                            email: 'jennifer.lee@example.com',
                            phone: '(555) 678-9012',
                            notes: 'Prefers volume and texture. Allergic to some hair products.',
                            avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
                        }
                    },
                    {
                        id: '7',
                        service: {
                            id: '104',
                            name: 'Men\'s Cut',
                            description: 'Men\'s haircut service',
                            price: 140,
                            duration: '1 hour',
                            category: 'Hair'
                        },
                        notes: 'This is a note',
                        start: new Date(new Date().setHours(9, 0, 0, 0)),
                        end: new Date(new Date().setHours(10, 0, 0, 0)),
                        customer: {
                            notes: 'Prefers a clean cut. Avoids gel products.',
                            id: 104,
                            name: 'David Miller',
                            email: 'david.miller@example.com',
                            phone: '(555) 789-0123',
                            avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
                        }
                    }
                ];

                setEvents(mockEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div>
            <CustomCalendar
                events={events}
                onEventClick={(event) => {
                    setSelectedEvent(event);
                    setShowOverlay(true);
                }}
            />
        </div>
    );
};

export default BookingList;
