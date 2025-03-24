'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

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

interface BookingOverlayProps {
  booking: CalendarEvent;
  onClose: () => void;
  onCheckIn?: () => void;
  onReschedule?: (newDate: Date) => void;
  onCancel?: () => void;
  onCharge?: (amount: number) => void;
}

const BookingOverlay: React.FC<BookingOverlayProps> = ({
  booking,
  onClose,
  onCheckIn,
  onReschedule,
  onCancel,
  onCharge
}) => {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState<Date>(booking.start);
  const [chargeAmount, setChargeAmount] = useState<number>(0);
  const [isCharging, setIsCharging] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const handleReschedule = () => {
    if (onReschedule) {
      onReschedule(newDate);
    }
    setIsRescheduling(false);
  };

  const handleCharge = () => {
    if (onCharge) {
      onCharge(chargeAmount);
    }
    setIsCharging(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setConfirmingCancel(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{booking.title}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <p><span className="font-medium">Client:</span> {booking.extendedProps.clientName}</p>
            <p><span className="font-medium">Service:</span> {booking.extendedProps.service}</p>
            <p><span className="font-medium">Phone:</span> {booking.extendedProps.phoneNumber}</p>
            <p><span className="font-medium">Date:</span> {format(new Date(booking.start), 'MMMM d, yyyy')}</p>
            <p><span className="font-medium">Time:</span> {format(new Date(booking.start), 'h:mm a')} - {format(new Date(booking.end), 'h:mm a')}</p>
          </div>

          {isRescheduling ? (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Reschedule Appointment</h4>
              <input
                type="datetime-local"
                className="input input-bordered w-full mb-2"
                value={format(newDate, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setNewDate(new Date(e.target.value))}
              />
              <div className="flex justify-end gap-2">
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsRescheduling(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleReschedule}
                >
                  Confirm
                </button>
              </div>
            </div>
          ) : isCharging ? (
            <div className="mt-4">
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
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsCharging(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCharge}
                >
                  Process Payment
                </button>
              </div>
            </div>
          ) : confirmingCancel ? (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-error">Cancel Appointment?</h4>
              <p className="mb-2">This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button 
                  className="btn btn-outline"
                  onClick={() => setConfirmingCancel(false)}
                >
                  Back
                </button>
                <button 
                  className="btn btn-error"
                  onClick={handleCancel}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-action flex flex-wrap gap-2">
              <button 
                className="btn btn-success"
                onClick={onCheckIn}
              >
                Check In
              </button>
              <button 
                className="btn btn-info"
                onClick={() => setIsRescheduling(true)}
              >
                Reschedule
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => setIsCharging(true)}
              >
                Charge
              </button>
              <button 
                className="btn btn-error"
                onClick={() => setConfirmingCancel(true)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingOverlay;
