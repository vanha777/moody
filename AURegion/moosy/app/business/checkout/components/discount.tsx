'use client';

import { useState } from 'react';
import { useAppContext } from '@/app/utils/AppContext';

interface DiscountProps {
  onSelectDiscount: (discountData: DiscountData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface DiscountData {
  id: string;
  name: string;
  value: number;
  description: string;
  type: string;
  increment: boolean;
  decrement: boolean;
}

export default function DiscountSelector({ onSelectDiscount, isOpen, onClose }: DiscountProps) {
  const { auth } = useAppContext();
  const [customPercentage, setCustomPercentage] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // In a real app, you'd fetch discounts from API or use from context
  const discounts: DiscountData[] = [
    { id: '18480a44-4ada-4768-a207-a86a0c18dc47', name: 'First-time customer', value: 10, description: 'First-time customer discount', type: 'discount', increment: false, decrement: true },
    { id: 'b222c23e-7aee-4e76-bef0-1d6660152233', name: 'Seasonal promotion', value: 15, description: 'Seasonal promotion discount', type: 'discount', increment: false, decrement: true },
    { id: 'faa8347a-1021-42fe-9982-ab8517fb4394', name: 'Loyalty discount', value: 5, description: 'Loyalty discount', type: 'discount', increment: false, decrement: true },
  ];

  const handleCustomSubmit = () => {
    const percentage = parseFloat(customPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      alert('Please enter a valid percentage between 1-100');
      return;
    }

    const customDiscount: DiscountData = {
      id: `custom-${Date.now()}`,
      name: customName || 'Custom Discount',
      value: percentage,
      description: 'Custom discount',
      type: 'discount',
      increment: false,
      decrement: true
    };

    onSelectDiscount(customDiscount);
    setCustomPercentage('');
    setCustomName('');
    setShowCustomForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full w-full overflow-y-auto">
        {/* Header */}
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
            <h1 className="text-xl font-semibold text-black">Select Discount</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
          <div className="space-y-4">
            {discounts.map((discount) => (
              <div
                key={discount.id}
                onClick={() => onSelectDiscount(discount)}
                className="p-4 border-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-black">{discount.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-black">-{discount.value}%</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Custom Discount Option */}
            {!showCustomForm ? (
              <div
                onClick={() => setShowCustomForm(true)}
                className="p-4 border-2 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-black">Create Custom Discount</h3>
                    <p className="text-sm text-gray-700">Add a custom discount percentage</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">Variable %</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-2 rounded-xl">
                <h3 className="font-medium mb-3 text-black">Custom Discount Details</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Discount name (optional)"
                    className="w-full p-2 border border-gray-300 rounded focus:border-gray-500 focus:outline-none"
                  />
                  <div className="relative">
                    <input
                      type="number"
                      value={customPercentage}
                      onChange={(e) => setCustomPercentage(e.target.value)}
                      placeholder="Enter percentage"
                      className="w-full p-2 border border-gray-300 rounded focus:border-gray-500 focus:outline-none pr-8"
                      min="1"
                      max="100"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCustomSubmit}
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      Add Discount
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
    </div>
  );
} 