'use client';

import React, { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';

interface AddBookingOverlayProps {
  onClose: () => void;
//   onAddBooking: (booking: {
//     title: string;
//     start: Date;
//     end: Date;
//     clientName: string;
//     service: string;
//     phoneNumber: string;
//   }) => void;
  selectedDate?: Date;
}

const AddBookingOverlay: React.FC<AddBookingOverlayProps> = ({
  onClose,
//   onAddBooking,
  selectedDate
}) => {
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [clientName, setClientName] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Update dates when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(addHours(selectedDate, 1)); // Default to 1 hour appointment
    } else {
      // Default fallback if no date is selected
      const now = new Date();
      setStartDate(now);
      setEndDate(addHours(now, 1));
    }
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // onAddBooking({
    //   title,
    //   start: startDate,
    //   end: endDate,
    //   clientName,
    //   service,
    //   phoneNumber
    // });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Booking</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Appointment Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Client Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Service</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Time</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={format(startDate, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">End Time</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={format(endDate, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                required
              />
            </div>
            
            <div className="modal-action flex justify-end gap-2 mt-6">
              <button 
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
              >
                Add Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookingOverlay;
