'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

interface BookingOverlayProps {
  booking: {
    id: string;
    clientName: string;
    service: string;
    phoneNumber: string;
    dateTime: Date;
  };
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
  const [newDate, setNewDate] = useState<Date>(booking.dateTime);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-box relative bg-white rounded-lg shadow-xl max-w-md w-full">
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h3 className="font-bold text-lg mb-4">Appointment Details</h3>
        
        <div className="py-4">
          <div className="mb-3">
            <span className="font-semibold">Client:</span> {booking.clientName}
          </div>
          <div className="mb-3">
            <span className="font-semibold">Service:</span> {booking.service}
          </div>
          <div className="mb-3">
            <span className="font-semibold">Phone:</span> {booking.phoneNumber}
          </div>
          <div className="mb-3">
            <span className="font-semibold">Date/Time:</span> {format(booking.dateTime, 'PPP p')}
          </div>
        </div>

        {isRescheduling ? (
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
  );
};

export default BookingOverlay;
