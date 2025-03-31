'use client';

import { use, useEffect, useState } from 'react';
import { useAppContext } from '@/app/utils/AppContext';
import { useRouter } from 'next/navigation';
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
  const { auth } = useAppContext();
  const router = useRouter();
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!auth) {
      router.push("/dashboard/login")
    }
  }, []);

  const catalogues = auth?.company?.services_by_catalogue || [];
  
  const services = selectedCatalogue === 'all' 
    ? catalogues.flatMap(catalogue => 
        catalogue.services.map(service => ({
          ...service,
          category: catalogue.catalogue.name
        }))
      )
    : catalogues
        .find(cat => cat.catalogue.id === selectedCatalogue)
        ?.services.map(service => ({
          ...service,
          category: catalogues.find(cat => cat.catalogue.id === selectedCatalogue)?.catalogue.name || ''
        })) || [];

  const selectedCatalogueName = selectedCatalogue === 'all' 
    ? 'All Categories' 
    : catalogues.find(cat => cat.catalogue.id === selectedCatalogue)?.catalogue.name || 'All Categories';

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

        {/* Innovative Dropdown */}
        <div className="relative mb-6">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                {selectedCatalogueName}
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <div 
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCatalogue === 'all' ? 'bg-gray-50' : ''
                }`}
                onClick={() => {
                  setSelectedCatalogue('all');
                  setIsDropdownOpen(false);
                }}
              >
                <span className="text-gray-600">All Categories</span>
              </div>
              {catalogues.map((cat) => (
                <div
                  key={cat.catalogue.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedCatalogue === cat.catalogue.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedCatalogue(cat.catalogue.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{cat.catalogue.name}</span>
                    <span className="text-gray-400 text-sm">{cat.services.length} services</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {services.map((service) => (
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
