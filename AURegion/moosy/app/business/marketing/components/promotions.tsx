'use client'
import { useState } from 'react';
import { FaBolt, FaClock, FaSun, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface Service {
  id: string;
  name: string;
  price: number;
}

interface PromotionType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  activeSubServices?: string[]; // Track which services are currently active
  settings?: {
    discountPercentage?: number;
    duration?: number;
    selectedServices?: string[]; // Array of service IDs
    startDate?: string;
    endDate?: string;
    weekdays?: string[];
    startTime?: string;
    endTime?: string;
  };
}

export default function Promotions({ close }: { close: () => void }) {
  // Mock services data - in real app, this would come from your backend
  const services: Service[] = [
    { id: '1', name: 'Haircut', price: 30 },
    { id: '2', name: 'Hair Coloring', price: 80 },
    { id: '3', name: 'Manicure', price: 25 },
    { id: '4', name: 'Pedicure', price: 35 },
    { id: '5', name: 'Facial', price: 60 },
  ];

  const weekdays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<PromotionType[]>([
    {
      id: 'flash-sales',
      title: 'Flash Sales',
      description: 'Create limited-time offers with steep discounts to drive immediate sales',
      icon: <FaBolt className="text-yellow-500" />,
      enabled: false,
      activeSubServices: [],
      settings: {
        discountPercentage: 20,
        duration: 24,
        selectedServices: []
      }
    },
    {
      id: 'last-minute',
      title: 'Last Minute Discount',
      description: 'Offer special pricing for customers who purchase just before an event or deadline',
      icon: <FaClock className="text-blue-500" />,
      enabled: false,
      activeSubServices: [],
      settings: {
        discountPercentage: 15,
        selectedServices: [],
        startDate: '',
        endDate: ''
      }
    },
    {
      id: 'happy-hours',
      title: 'Happy Hours',
      description: 'Set specific times of day with special pricing to increase traffic during slow periods',
      icon: <FaSun className="text-orange-500" />,
      enabled: false,
      activeSubServices: [],
      settings: {
        discountPercentage: 15,
        selectedServices: [],
        weekdays: [],
        startTime: '',
        endTime: ''
      }
    }
  ]);

  const togglePromotion = (id: string) => {
    setPromotions(promotions.map(promotion => 
      promotion.id === id ? { ...promotion, enabled: !promotion.enabled } : promotion
    ));
  };

  const updatePromotionSettings = (id: string, settings: any) => {
    setPromotions(promotions.map(promotion => 
      promotion.id === id 
        ? { ...promotion, settings: { ...promotion.settings, ...settings } }
        : promotion
    ));
  };

  const toggleService = (serviceId: string) => {
    const promotion = promotions.find(p => p.id === selectedPromotion);
    const currentServices = promotion?.settings?.selectedServices || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];
    
    updatePromotionSettings(selectedPromotion!, {
      selectedServices: newServices
    });
  };

  const toggleWeekday = (day: string) => {
    const promotion = promotions.find(p => p.id === selectedPromotion);
    const currentWeekdays = promotion?.settings?.weekdays || [];
    const newWeekdays = currentWeekdays.includes(day)
      ? currentWeekdays.filter(d => d !== day)
      : [...currentWeekdays, day];
    
    updatePromotionSettings(selectedPromotion!, {
      weekdays: newWeekdays
    });
  };

  const toggleSubServiceActive = (promotionId: string, serviceId: string) => {
    setPromotions(promotions.map(promotion => {
      if (promotion.id === promotionId) {
        const currentActive = promotion.activeSubServices || [];
        const newActive = currentActive.includes(serviceId)
          ? currentActive.filter(id => id !== serviceId)
          : [...currentActive, serviceId];
        return { ...promotion, activeSubServices: newActive };
      }
      return promotion;
    }));
  };

  const handleSave = () => {
    const promotion = promotions.find(p => p.id === selectedPromotion);
    // if (!promotion?.settings?.selectedServices?.length) {
    //   alert('Please select at least one service');
    //   return;
    // }
    // if (!promotion?.settings?.discountPercentage) {
    //   alert('Please set a discount percentage');
    //   return;
    // }
    // if (!promotion?.settings?.duration) {
    //   alert('Please set a duration');
    //   return;
    // }
    
    // Update activeSubServices with selected services
    setPromotions(promotions.map(p => {
      if (p.id === selectedPromotion) {
        return {
          ...p,
          activeSubServices: p.settings?.selectedServices || []
        };
      }
      return p;
    }));

    // Here you would typically save to your backend
    console.log('Saving promotion:', promotion);
    // Close the form after saving
    setSelectedPromotion(null);
  };

  return (
    <div className="p-6 bg-white">
      {!selectedPromotion && (
        <button 
          onClick={close}
          className="mb-4 flex items-center text-gray-600 hover:text-black"
        >
          <svg 
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      )}

      {!selectedPromotion ? (
        <>
          <h1 className="text-2xl font-bold mb-4 text-black">Create Promotion</h1>
          <p className="text-gray-600 mb-6">Select a promotion type to create. You can have one active promotion for each category.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {promotions.map((promotion) => (
              <div 
                key={promotion.id}
                className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:border-black transition-colors relative"
                onClick={() => setSelectedPromotion(promotion.id)}
              >
                {promotion.enabled && (
                  <div className="absolute top-3 right-3 flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                    <span className="text-xs font-medium text-green-700 bg-green-50 rounded-full px-2 py-1">Running</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {promotion.icon}
                  <h3 className="text-lg font-semibold text-black">{promotion.title}</h3>
                </div>
                <p className="text-gray-600 mb-3">{promotion.description}</p>
                
                {/* Active Services Indicators */}
                {promotion.activeSubServices && promotion.activeSubServices.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-xs font-medium text-gray-500">Active Services:</div>
                    <div className="flex flex-wrap gap-1">
                      {promotion.activeSubServices.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        return service ? (
                          <span 
                            key={serviceId}
                            className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-xs text-green-700"
                          >
                            {service.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setSelectedPromotion(null)}
                className="text-gray-600 hover:text-black flex items-center gap-2"
              >
                ← Back
              </button>
              <div 
                className="cursor-pointer"
                onClick={() => togglePromotion(selectedPromotion)}
              >
                {promotions.find(p => p.id === selectedPromotion)?.enabled ? (
                  <FaToggleOn size={28} className="text-black" />
                ) : (
                  <FaToggleOff size={28} className="text-gray-300" />
                )}
              </div>
            </div>

            {selectedPromotion === 'flash-sales' && (
              <div className="space-y-6">
                {/* Services Selection */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Select Services
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          promotions.find(p => p.id === selectedPromotion)?.activeSubServices?.includes(service.id)
                            ? 'border-green-500 bg-green-50'
                            : 'hover:border-black'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox border-2 border-gray-300 checked:border-black checked:bg-black rounded mr-3"
                          checked={promotions.find(p => p.id === selectedPromotion)?.settings?.selectedServices?.includes(service.id) || false}
                          onChange={() => toggleService(service.id)}
                        />
                        <div>
                          <div className="font-medium text-black">
                            {service.name}
                            {promotions.find(p => p.id === selectedPromotion)?.activeSubServices?.includes(service.id) && (
                              <span className="ml-2 text-xs text-green-600">(Active)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">${service.price}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Discount Percentage
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:border-black"
                      value={promotions.find(p => p.id === selectedPromotion)?.settings?.discountPercentage || ''}
                      onChange={(e) => updatePromotionSettings(selectedPromotion, {
                        discountPercentage: parseInt(e.target.value)
                      })}
                      placeholder="Enter discount percentage"
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-gray-600">
                      %
                    </span>
                  </div>
                </div>

                {/* Duration in Hours */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Duration
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      max="72"
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:border-black"
                      value={promotions.find(p => p.id === selectedPromotion)?.settings?.duration || ''}
                      onChange={(e) => updatePromotionSettings(selectedPromotion, {
                        duration: parseInt(e.target.value)
                      })}
                      placeholder="Enter duration"
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-gray-600">
                      hours
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                    disabled={!promotions.find(p => p.id === selectedPromotion)?.settings?.selectedServices?.length ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.discountPercentage ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.duration}
                  >
                    Save Flash Sale
                  </button>
                </div>
              </div>
            )}

            {selectedPromotion === 'last-minute' && (
              <div className="space-y-6">
                {/* Services Selection */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Select Services
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          promotions.find(p => p.id === selectedPromotion)?.activeSubServices?.includes(service.id)
                            ? 'border-green-500 bg-green-50'
                            : 'hover:border-black'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox border-2 border-gray-300 checked:border-black checked:bg-black rounded mr-3"
                          checked={promotions.find(p => p.id === selectedPromotion)?.settings?.selectedServices?.includes(service.id) || false}
                          onChange={() => toggleService(service.id)}
                        />
                        <div>
                          <div className="font-medium text-black">
                            {service.name}
                            {promotions.find(p => p.id === selectedPromotion)?.activeSubServices?.includes(service.id) && (
                              <span className="ml-2 text-xs text-green-600">(Active)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">${service.price}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Discount Percentage
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:border-black"
                      value={promotions.find(p => p.id === selectedPromotion)?.settings?.discountPercentage || ''}
                      onChange={(e) => updatePromotionSettings(selectedPromotion, {
                        discountPercentage: parseInt(e.target.value)
                      })}
                      placeholder="Enter discount percentage"
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-gray-600">
                      %
                    </span>
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Promotion Period
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                        value={promotions.find(p => p.id === selectedPromotion)?.settings?.startDate || ''}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => updatePromotionSettings(selectedPromotion, {
                          startDate: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                        value={promotions.find(p => p.id === selectedPromotion)?.settings?.endDate || ''}
                        min={promotions.find(p => p.id === selectedPromotion)?.settings?.startDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => updatePromotionSettings(selectedPromotion, {
                          endDate: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                    disabled={!promotions.find(p => p.id === selectedPromotion)?.settings?.selectedServices?.length ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.discountPercentage ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.startDate ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.endDate}
                  >
                    Save Last Minute Discount
                  </button>
                </div>
              </div>
            )}

            {selectedPromotion === 'happy-hours' && (
              <div className="space-y-6">
                {/* Services Selection */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Select Services
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          promotions.find(p => p.id === selectedPromotion)?.activeSubServices?.includes(service.id)
                            ? 'border-green-500 bg-green-50'
                            : 'hover:border-black'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox border-2 border-gray-300 checked:border-black checked:bg-black rounded mr-3"
                          checked={promotions.find(p => p.id === selectedPromotion)?.settings?.selectedServices?.includes(service.id) || false}
                          onChange={() => toggleService(service.id)}
                        />
                        <div>
                          <div className="font-medium text-black">
                            {service.name}
                            {promotions.find(p => p.id === selectedPromotion)?.activeSubServices?.includes(service.id) && (
                              <span className="ml-2 text-xs text-green-600">(Active)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">${service.price}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Weekday Selection */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Select Days
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {weekdays.map((day) => (
                      <label
                        key={day.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          promotions.find(p => p.id === selectedPromotion)?.settings?.weekdays?.includes(day.id)
                            ? 'border-black bg-gray-50'
                            : 'hover:border-black'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox border-2 border-gray-300 checked:border-black checked:bg-black rounded mr-3"
                          checked={promotions.find(p => p.id === selectedPromotion)?.settings?.weekdays?.includes(day.id) || false}
                          onChange={() => toggleWeekday(day.id)}
                        />
                        <span className="text-sm font-medium">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Time Range
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                        value={promotions.find(p => p.id === selectedPromotion)?.settings?.startTime || ''}
                        onChange={(e) => updatePromotionSettings(selectedPromotion, {
                          startTime: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                        value={promotions.find(p => p.id === selectedPromotion)?.settings?.endTime || ''}
                        onChange={(e) => updatePromotionSettings(selectedPromotion, {
                          endTime: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Discount Percentage
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:border-black"
                      value={promotions.find(p => p.id === selectedPromotion)?.settings?.discountPercentage || ''}
                      onChange={(e) => updatePromotionSettings(selectedPromotion, {
                        discountPercentage: parseInt(e.target.value)
                      })}
                      placeholder="Enter discount percentage"
                    />
                    <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-gray-600">
                      %
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                    disabled={!promotions.find(p => p.id === selectedPromotion)?.settings?.selectedServices?.length ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.discountPercentage ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.weekdays?.length ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.startTime ||
                             !promotions.find(p => p.id === selectedPromotion)?.settings?.endTime}
                  >
                    Save Happy Hours
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
