'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from './booking';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/utils/AppContext';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

interface BookingOverlayProps {
  booking: CalendarEvent;
  onClose: () => void;
  onCheckIn?: () => void;
  onReschedule?: (newDate: Date) => void;
  onCancel?: () => void;
  onCharge?: (amount: number) => void;
}

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Success!</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-black text-white rounded-lg font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

const BookingOverlay: React.FC<BookingOverlayProps> = ({
  booking,
  onClose,
  onCheckIn,
  onReschedule,
  onCancel,
  onCharge
}) => {
  const { cancelBooking, rescheduleBooking } = useAppContext();
  const router = useRouter();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState<Date>(booking.start);
  const [chargeAmount, setChargeAmount] = useState<number>(0);
  const [isCharging, setIsCharging] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleReschedule = async (booking: CalendarEvent, newDate: Date) => {
    try {
      const duration = booking.service.duration; // Assuming format "HH:MM:SS"
      console.log("Duration", duration);
      
      // Parse duration string (HH:MM:SS) into milliseconds
      const [hours, minutes, seconds] = duration.split(':').map(Number);
      const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

      // Convert local time to UTC using the system's timezone
      const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const localDate = toZonedTime(newDate, localTimezone);
      const utcStartDate = fromZonedTime(newDate, localTimezone);
      
      // Calculate UTC end time by adding duration to UTC start time
      const utcEndDate = new Date(utcStartDate.getTime() + durationMs);

      console.log("Detected local timezone:", localTimezone);
      console.log("Original local time:", newDate.toLocaleString());
      console.log("Converted UTC start time:", utcStartDate.toUTCString());
      console.log("Calculated UTC end time:", utcEndDate.toUTCString());
      console.log("Duration (hours.ConcurrentModificationException):", durationMs / (1000 * 60 * 60));
      console.log("Time difference (hours):", 
        (utcStartDate.getTime() - localDate.getTime()) / (1000 * 60 * 60)
      );

      const response = await rescheduleBooking(booking.id, utcStartDate,utcEndDate);
      console.log("Rescheduling booking response", response);
      if (onReschedule) {
        onReschedule(utcStartDate);
      }
    } catch (error) {
      console.error("Error rescheduling booking", error);
    } finally {
      setIsRescheduling(false);
      setSuccessMessage("Appointment successfully rescheduled!");
    }
  };

  const handleCharge = () => {
    if (onCharge) {
      onCharge(chargeAmount);
    }
    setIsCharging(false);
  };

  const handleCancel = async (bookingId: string) => {
    if (onCancel) {
      onCancel();
    }
    try {
      const response = await cancelBooking(bookingId);
      console.log("Cancel Booking response", response);
      if (response) {
        setSuccessMessage("Appointment successfully cancelled!");
      }
    } catch (error) {
      console.error("Error cancelling booking", error);
    } finally {
      setConfirmingCancel(false);
    }
  };

  const handleCheckout = () => {
    const bookingData = JSON.stringify(booking);
    const encodedBooking = encodeURIComponent(bookingData);
    router.push(`/business/checkout?booking=${encodedBooking}`);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center px-4 py-6 border-b border-gray-200">
        <button
          onClick={onClose}
          className="text-black p-2"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-xl font-semibold ml-4">Appointment Details</h1>
      </div>

      {/* Main content wrapper with padding bottom */}
      <div className="pb-36">
        {/* Client Info Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {booking.customer.avatar ? (
                <img src={booking.customer.avatar} alt="Customer Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                booking.customer.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{booking.customer.name}</h2>
              <p className="text-gray-600">{booking.customer.phone}</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-gray-600">Service</p>
            <p className="font-medium">{booking.service.name}</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">Date & Time</p>
            <p className="font-medium">
              {format(new Date(booking.start), 'MMMM d, yyyy')}
              <br />
              {format(new Date(booking.start), 'h:mm a')} - {format(new Date(booking.end), 'h:mm a')}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-600">Notes</p>
            <div className="w-full border border-gray-200 rounded-lg p-3 min-h-[100px] bg-gray-50">
              {booking.customer.notes || "No notes for this customer"}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isRescheduling && !isCharging && !confirmingCancel && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 space-y-2">
          <button
            className="w-full py-3 bg-black text-white rounded-lg font-medium"
            onClick={handleCheckout}
          >
            Check Out
          </button>
          <div className="flex space-x-2">
            <button
              className="flex-1 py-3 border border-black rounded-lg font-medium"
              onClick={() => setIsRescheduling(true)}
            >
              Reschedule
            </button>
            <button
              className="flex-1 py-3 border border-black rounded-lg font-medium text-red-600"
              onClick={() => setConfirmingCancel(true)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rescheduling, Charging, and Cancel Confirmation UI */}
      {isRescheduling && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <h4 className="font-semibold mb-4 text-center text-lg">Reschedule Appointment</h4>
          <div className="space-y-4 mb-4">
            {/* Date Selector */}
            <div>
              <p className="text-gray-600 text-center mb-2">Date</p>
              <div className="flex justify-center">
                <input
                  type="date"
                  className="text-center text-xl py-4 px-6 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-black w-64"
                  style={{
                    minHeight: '60px',
                    fontSize: '1.25rem',
                    background: '#f8f8f8'
                  }}
                  value={format(newDate, "yyyy-MM-dd")}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const hours = newDate.getHours();
                    const minutes = newDate.getMinutes();
                    date.setHours(hours, minutes);
                    setNewDate(date);
                  }}
                />
              </div>
            </div>

            {/* Time Selector */}
            <div>
              <p className="text-gray-600 text-center mb-2">Time</p>
              <div className="flex justify-center">
                <input
                  type="time"
                  className="text-center text-xl py-4 px-6 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-black w-64"
                  style={{
                    minHeight: '60px',
                    fontSize: '1.25rem',
                    background: '#f8f8f8'
                  }}
                  value={format(newDate, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDateTime = new Date(newDate);
                    newDateTime.setHours(parseInt(hours), parseInt(minutes));
                    setNewDate(newDateTime);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              className="flex-1 py-3 border border-black rounded-lg"
              onClick={() => setIsRescheduling(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-3 bg-black text-white rounded-lg"
              onClick={() => handleReschedule(booking, newDate)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {isCharging ? (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <h4 className="font-semibold mb-2">Charge Client</h4>
          <div className="form-control">
            <label className="input-group">
              <span>$</span>
              <input
                type="number"
                placeholder="0.00"
                className="input input-bordered w-full"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              className="flex-1 py-3 border border-black rounded-lg"
              onClick={() => setIsCharging(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-3 bg-black text-white rounded-lg"
              onClick={handleCharge}
            >
              Process Payment
            </button>
          </div>
        </div>
      ) : confirmingCancel ? (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <h4 className="font-semibold mb-2 text-error">Cancel Appointment?</h4>
          <p className="mb-2">This action cannot be undone.</p>
          <div className="flex space-x-2">
            <button
              className="flex-1 py-3 border border-black rounded-lg"
              onClick={() => setConfirmingCancel(false)}
            >
              Back
            </button>
            <button
              className="flex-1 py-3 bg-red-600 text-white rounded-lg"
              onClick={() => handleCancel(booking.id)}
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      ) : null}

      {/* Success Message Overlay */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => {
            setSuccessMessage(null);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default BookingOverlay;
