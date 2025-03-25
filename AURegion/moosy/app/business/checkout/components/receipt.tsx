'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ServiceData } from './service';

interface ReceiptProps {
  customerName: string;
  service: ServiceData;
  appointmentDate?: Date;
  onCancel: () => void;
  onReschedule: () => void;
  onCheckout: () => void;
}

export default function Receipt({
  customerName,
  service,
  appointmentDate,
  onCancel,
  onReschedule,
  onCheckout
}: ReceiptProps) {
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderTime, setReminderTime] = useState('1hour');

  const handleSetReminder = () => {
    setReminderSet(!reminderSet);
    // In a real app, this would integrate with a notification system
  };

  const formattedDate = appointmentDate 
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(appointmentDate)
    : 'Not scheduled';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Receipt</h2>
        <p className="text-gray-600">Thank you for your business!</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
        <p className="text-gray-700">{customerName}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Service Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="font-medium">{service.name}</span>
            <span className="font-medium">${service.price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
          <p className="text-sm text-gray-600">Duration: {service.duration}</p>
        </div>
      </div>

      {appointmentDate && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Appointment Time</h3>
          <p className="text-gray-700">{formattedDate}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Set Reminder</h3>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={reminderSet}
              onChange={handleSetReminder}
            />
            <span className="ml-2 text-gray-700">Remind me</span>
          </label>
          
          {reminderSet && (
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="form-select rounded border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="30min">30 minutes before</option>
              <option value="1hour">1 hour before</option>
              <option value="1day">1 day before</option>
              <option value="1week">1 week before</option>
            </select>
          )}
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            Total: ${service.price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <button
          onClick={onCancel}
          className="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onReschedule}
          className="py-2 px-4 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          Reschedule
        </button>
        <button
          onClick={onCheckout}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
