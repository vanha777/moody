'use client';

import React, { useState, useEffect } from 'react';
import { format, addHours } from 'date-fns';
import ContactList, { ContactProps } from "@/app/business/clients/components/businesses";
import ServiceSelector, { ServiceData } from "@/app/business/checkout/components/service";
import { useAppContext } from '@/app/utils/AppContext';
import StaffSelection, { StaffProps } from "@/app/dashboard/components/staffSelection";

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

export interface BookingFormData {
  title: string;
  startDate: Date;
  endDate: Date;
  client: ContactProps | null;
  staff: StaffProps | null;
  services: ServiceData[];
  phoneNumber: string;
}

const AddBookingOverlay: React.FC<AddBookingOverlayProps> = ({
  onClose,
//   onAddBooking,
  selectedDate
}) => {
  const { auth, addBooking } = useAppContext();
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    title: '',
    startDate: new Date(),
    endDate: addHours(new Date(), 1),
    client: null,
    staff: null,
    services: [],
    phoneNumber: ''
  });

  // Update dates when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        startDate: selectedDate,
        endDate: addHours(selectedDate, 1)
      }));
    }
  }, [selectedDate]);

  const handleClientSelect = (client: ContactProps) => {
    setFormData(prev => ({
      ...prev,
      client: client,
      phoneNumber: client.phone || ''
    }));
    setShowContactModal(false);
  };

  const handleStaffSelect = (staff: StaffProps) => {
    setFormData(prev => ({
      ...prev,
      staff: staff
    }));
    setShowStaffModal(false);
  };

  const handleServiceSelect = (service: ServiceData) => {
    setFormData(prev => {
      // Check if service already exists in the array
      const serviceExists = prev.services.some(s => s.id === service.id);
      if (serviceExists) {
        return prev; // Don't add duplicate service
      }
      
      const updatedServices = [...prev.services, service];
      
      // Update title if it's the first service
      const title = prev.title || service.name;
      
      // Calculate new duration based on all selected services
      let totalDurationMinutes = 0;
      updatedServices.forEach(svc => {
        // Parse duration from format like "01:30:00" (hh:mm:ss) or "90 min"
        const durationString = svc.duration;
        let durationMinutes = 0;
        
        if (durationString.includes(':')) {
          // Parse time format "hh:mm:ss"
          const [hours, minutes] = durationString.split(':');
          durationMinutes = (parseInt(hours) * 60) + parseInt(minutes);
        } else if (durationString.includes('min')) {
          // Parse format like "90 min"
          durationMinutes = parseInt(durationString);
        } else {
          // Default if format is unknown
          durationMinutes = 60;
        }
        
        totalDurationMinutes += durationMinutes;
      });
      
      // Calculate new end date based on total duration
      const newEndDate = new Date(prev.startDate.getTime() + totalDurationMinutes * 60000);
      
      return {
        ...prev,
        services: updatedServices,
        title: title,
        endDate: newEndDate
      };
    });
    setShowServiceModal(false);
  };

  const handleRemoveService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const hours = formData.startDate.getHours();
    const minutes = formData.startDate.getMinutes();
    date.setHours(hours, minutes);
    
    // Calculate current duration in milliseconds
    const durationMs = formData.endDate.getTime() - formData.startDate.getTime();
    
    setFormData(prev => ({
      ...prev,
      startDate: date,
      endDate: new Date(date.getTime() + durationMs)
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [hours, minutes] = e.target.value.split(':');
    const newDate = new Date(formData.startDate);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    
    // Calculate current duration in milliseconds
    const durationMs = formData.endDate.getTime() - formData.startDate.getTime();
    
    setFormData(prev => ({
      ...prev,
      startDate: newDate,
      endDate: new Date(newDate.getTime() + durationMs)
    }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const durationMinutes = parseInt(e.target.value);
    const newEndDate = new Date(formData.startDate.getTime() + durationMinutes * 60000);
    
    setFormData(prev => ({
      ...prev,
      endDate: newEndDate
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert dates to UTC format
    const formDataWithUTC = {
      ...formData,
      startDate: new Date(formData.startDate.toISOString()),
      endDate: new Date(formData.endDate.toISOString())
    };
    // console.log is all wrong because browser timezone is wrong
    // console.log("handle submit", formDataWithUTC);
    try{
      const response = await addBooking(formDataWithUTC);
      console.log("response", response);
    } catch (error) {
      console.error("Error adding booking:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {!showContactModal && !showServiceModal && !showStaffModal ? (
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
            {/* Client Selection Box */}
            <div 
              onClick={() => setShowContactModal(true)}
              className="p-4 border-2 rounded-xl cursor-pointer hover:border-gray-400"
            >
              {formData.client ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                      {formData.client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{formData.client.name}</p>
                      <p className="text-sm text-gray-500">{formData.client.phone}</p>
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

            {/* Staff Selection Box */}
            <div 
              onClick={() => setShowStaffModal(true)}
              className="p-4 border-2 rounded-xl cursor-pointer hover:border-gray-400"
            >
              {formData.staff ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                      {formData.staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{formData.staff.name}</p>
                      <p className="text-sm text-gray-500">{formData.staff.role}</p>
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
                    <p className="font-medium text-gray-600">Select a staff member</p>
                    <p className="text-sm text-gray-400">Click to choose a staff member</p>
                  </div>
                </div>
              )}
            </div>

            {/* Services Section */}
            <div className="p-4 border-2 rounded-xl bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Services</h3>
                <button
                  type="button"
                  onClick={() => setShowServiceModal(true)}
                  className="text-sm text-blue-600 font-medium"
                >
                  + Add Service
                </button>
              </div>
              
              {formData.services.length > 0 ? (
                <div className="space-y-3">
                  {formData.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-500">${service.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(service.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <p className="font-medium">Total</p>
                      <p className="font-semibold">
                        ${formData.services.reduce((sum, service) => sum + (Number(service.price) || 0), 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setShowServiceModal(true)}
                  className="flex items-center space-x-4 cursor-pointer p-2"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Add services</p>
                    <p className="text-sm text-gray-400">Click to add services</p>
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
                  value={format(formData.startDate, "yyyy-MM-dd")}
                  onChange={handleDateChange}
                  required
                />
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Start Time</p>
                    <select
                      className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-black text-center text-lg appearance-none"
                      value={format(formData.startDate, "HH:mm")}
                      onChange={handleTimeChange}
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
                      value={(formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60)}
                      onChange={handleDurationChange}
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                      <option value="150">2.5 hours</option>
                      <option value="180">3 hours</option>
                      <option value="210">3.5 hours</option>
                      <option value="240">4 hours</option>
                      <option value="300">5 hours</option>
                      <option value="360">6 hours</option>
                      <option value="420">7 hours</option>
                      <option value="480">8 hours</option>
                      {/* Add a custom option if the calculated duration doesn't match predefined values */}
                      {![15, 30, 45, 60, 90, 120, 150, 180, 210, 240, 300, 360, 420, 480].includes(
                        (formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60)
                      ) && (
                        <option value={(formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60)}>
                          {Math.floor((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60))} hr {((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60)) % 60} min
                        </option>
                      )}
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
                disabled={!formData.client || formData.services.length === 0}
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

      {showStaffModal && (
        <StaffSelection
          onStaffSelect={handleStaffSelect}
          onClose={() => setShowStaffModal(false)}
        />
      )}
    </div>
  );
};

export default AddBookingOverlay;
