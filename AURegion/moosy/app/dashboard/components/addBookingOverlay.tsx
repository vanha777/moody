'use client';

import React, { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import ContactList, { ContactProps } from "@/app/business/clients/components/businesses";
import ServiceSelector, { ServiceData } from "@/app/business/checkout/components/service";

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
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ContactProps | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
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

  const handleClientSelect = (client: ContactProps) => {
    setSelectedClient(client);
    setPhoneNumber(client.phone || '');
    setShowContactModal(false);
  };

  const handleServiceSelect = (service: ServiceData) => {
    setSelectedService(service);
    setTitle(service.name);
    setShowServiceModal(false);
  };

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
    <div className="min-h-screen bg-white">
      {!showContactModal && !showServiceModal ? (
        <>
          {/* Header - Updated to match checkout style */}
          <div className="bg-white px-4 py-6 border-b">
            <div className="flex items-center justify-start max-w-3xl mx-auto">
              <button
                onClick={onClose}
                className="text-black hover:text-gray-700 mr-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-black">New Appointment</h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
            {/* Client Selection Box - Updated to match checkout style */}
            <div 
              onClick={() => setShowContactModal(true)}
              className="p-4 border-2 rounded-xl cursor-pointer hover:border-gray-400"
            >
              {selectedClient ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                      {selectedClient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedClient.name}</p>
                      <p className="text-sm text-gray-500">{selectedClient.phone}</p>
                    </div>
                  </div>
                  <div className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Select a client</p>
                    <p className="text-sm text-gray-400">Click to choose a client</p>
                  </div>
                </div>
              )}
            </div>

            {/* Service Selection Box */}
            <div 
              onClick={() => setShowServiceModal(true)}
              className="p-4 border-2 rounded-xl cursor-pointer hover:border-gray-400"
            >
              {selectedService ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{selectedService.name}</p>
                    <p className="text-sm text-gray-500">${selectedService.price}</p>
                  </div>
                  <div className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Select a service</p>
                    <p className="text-sm text-gray-400">Click to choose a service</p>
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time Selection - iPhone style */}
            <div className="p-4 border-2 rounded-xl bg-white">
              <h3 className="font-semibold mb-4">Date & Time</h3>
              <div className="space-y-4">
                <input
                  type="date"
                  className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-black text-center text-lg"
                  value={format(startDate, "yyyy-MM-dd")}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const hours = startDate.getHours();
                    const minutes = startDate.getMinutes();
                    date.setHours(hours, minutes);
                    setStartDate(date);
                    setEndDate(addHours(date, 1));
                  }}
                  required
                />
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Start Time</p>
                    <select
                      className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-black text-center text-lg appearance-none"
                      value={format(startDate, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(startDate);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setStartDate(newDate);
                        setEndDate(addHours(newDate, 1));
                      }}
                    >
                      {Array.from({ length: 24 * 4 }).map((_, i) => {
                        const hours = Math.floor(i / 4);
                        const minutes = (i % 4) * 15;
                        return (
                          <option key={i} value={`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}>
                            {format(new Date().setHours(hours, minutes), 'hh:mm a')}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Duration</p>
                    <select
                      className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-black text-center text-lg appearance-none"
                      value={(endDate.getTime() - startDate.getTime()) / (1000 * 60)}
                      onChange={(e) => {
                        const durationMinutes = parseInt(e.target.value);
                        setEndDate(new Date(startDate.getTime() + durationMinutes * 60000));
                      }}
                    >
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleSubmit}
                disabled={!selectedClient || !selectedService}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Add Appointment
              </button>
            </div>
          </div>
        </>
      ) : null}

      {/* Modals */}
      {showContactModal && (
        <ContactList
          onContactSelect={handleClientSelect}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {showServiceModal && (
        <ServiceSelector
          onSelectService={handleServiceSelect}
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
        />
      )}
    </div>
  );
};

export default AddBookingOverlay;
