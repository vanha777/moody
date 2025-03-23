'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from 'date-fns';

interface Booking {
  id: string;
  clientName: string;
  service: string;
  phoneNumber: string;
  dateTime: Date;
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          }
        ];
        
        setBookings(mockBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          &lt;
        </button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={nextMonth}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Get bookings for this day
        const dayBookings = bookings.filter(booking => 
          isSameDay(booking.dateTime, cloneDay)
        );
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-2 border border-gray-200 ${
              !isSameMonth(day, monthStart)
                ? 'text-gray-400 bg-gray-50'
                : isSameDay(day, selectedDate)
                ? 'bg-blue-100'
                : 'bg-white'
            } cursor-pointer`}
            onClick={() => onDateClick(cloneDay)}
          >
            <div className="text-right">{formattedDate}</div>
            <div className="mt-1">
              {dayBookings.map(booking => (
                <div 
                  key={booking.id}
                  className="text-xs p-1 mb-1 bg-blue-500 text-white rounded truncate"
                  title={`${booking.clientName} - ${booking.service} - ${format(booking.dateTime, 'h:mm a')}`}
                >
                  {format(booking.dateTime, 'h:mm a')} - {booking.clientName}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Booking Calendar</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">
          {format(selectedDate, 'MMMM d, yyyy')} Bookings
        </h2>
        <div className="border rounded-lg overflow-hidden">
          {bookings.filter(booking => 
            isSameDay(booking.dateTime, selectedDate)
          ).length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No bookings for this date
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings
                  .filter(booking => isSameDay(booking.dateTime, selectedDate))
                  .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
                  .map(booking => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(booking.dateTime, 'h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.phoneNumber}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
