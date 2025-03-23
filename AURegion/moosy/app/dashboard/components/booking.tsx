'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import BookingOverlay from './bookingOverlay';
interface Booking {
  id: string;
  clientName: string;
  service: string;
  phoneNumber: string;
  dateTime: Date;
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

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
  }, [selectedDate]);

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
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Bookings</h1>
      
      <div className="mb-6">
        <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          id="date-select"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={handleDateChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No bookings scheduled for this date.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Client Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Service</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Phone Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleBookingClick(booking)}
                >
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">
                    {format(booking.dateTime, 'h:mm a')}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{booking.clientName}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{booking.service}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{booking.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showOverlay && selectedBooking && (
        <BookingOverlay 
          booking={selectedBooking} 
          onClose={handleCloseOverlay} 
        />
      )}
    </div>
  );
};

export default BookingList;
