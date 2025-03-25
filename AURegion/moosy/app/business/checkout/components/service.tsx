'use client';

import { useState } from 'react';

interface ServiceProps {
  onSelectService: (serviceData: ServiceData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

export default function ServiceSelector({ onSelectService, isOpen, onClose }: ServiceProps) {
  // Mock service data - in a real app, this would come from props or an API
  const mockServices: ServiceData[] = [
    {
      id: '1',
      name: 'Basic Consultation',
      description: 'Initial consultation to discuss needs and requirements',
      price: 99.99,
      duration: '1 hour',
      category: 'Consultation'
    },
    {
      id: '2',
      name: 'Premium Support',
      description: 'Advanced support with priority response',
      price: 199.99,
      duration: '2 hours',
      category: 'Support'
    },
    {
      id: '3',
      name: 'Custom Development',
      description: 'Tailored development services for specific needs',
      price: 499.99,
      duration: 'Variable',
      category: 'Development'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full w-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Service</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {mockServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="text-sm text-gray-600">Duration: {service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${service.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{service.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
