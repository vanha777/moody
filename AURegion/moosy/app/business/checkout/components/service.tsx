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
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState(false);

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

  const handleCustomSubmit = () => {
    const price = parseFloat(customPrice);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const customService: ServiceData = {
      id: 'custom',
      name: 'Custom Service',
      description: customDescription || 'Custom service charge',
      price: price,
      duration: 'Variable',
      category: 'Custom'
    };

    onSelectService(customService);
    setCustomPrice('');
    setCustomDescription('');
    setShowCustomForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full w-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Select Service</h2>
          <button 
            onClick={onClose}
            className="text-black hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {mockServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-black">{service.name}</h3>
                  <p className="text-sm text-gray-700">{service.description}</p>
                  <p className="text-sm text-gray-700">Duration: {service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-black">${service.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-700">{service.category}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Service Option */}
          {!showCustomForm ? (
            <div
              onClick={() => setShowCustomForm(true)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-black">Create Custom Charge</h3>
                  <p className="text-sm text-gray-700">Add a custom service with your own price</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">Variable</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium mb-3 text-black">Custom Charge Details</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full p-2 border border-gray-300 rounded focus:border-gray-500 focus:outline-none"
                  step="0.01"
                  min="0"
                />
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Enter description (optional)"
                  className="w-full p-2 border border-gray-300 rounded focus:border-gray-500 focus:outline-none"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCustomSubmit}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Add Custom Charge
                  </button>
                  <button
                    onClick={() => setShowCustomForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
