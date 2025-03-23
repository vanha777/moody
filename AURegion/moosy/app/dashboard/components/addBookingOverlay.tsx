'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

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
  initialDate?: Date;
}

const AddBookingOverlay: React.FC<AddBookingOverlayProps> = ({
  onClose,
//   onAddBooking,
  initialDate
}) => {
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(initialDate || new Date());
  const [endDate, setEndDate] = useState<Date>(
    initialDate 
      ? new Date(initialDate.getTime() + 60 * 60 * 1000) 
      : new Date(new Date().getTime() + 60 * 60 * 1000)
  ); // Default to 1 hour later
  const [clientName, setClientName] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

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
