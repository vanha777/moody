'use client'
import { useState } from 'react';
import { FaToggleOn, FaToggleOff, FaImage, FaCheck, FaCalendarAlt, FaBirthdayCake, FaStar, FaUserClock } from 'react-icons/fa';
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import { motion } from 'framer-motion';

interface SmsAutomation {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    enabled: boolean;
    message: string;
    image: string | null;
}

export default function SmsMarketing({ close }: { close: () => void }) {
    const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
    const [automations, setAutomations] = useState<SmsAutomation[]>([
        {
            id: 'welcome',
            title: 'Welcome Message',
            description: 'Say hi to every client after their first two bookings',
            icon: <FaCheck className="text-green-500" />,
            enabled: false,
            message: 'Thank you for choosing our services! We hope you enjoyed your experience and look forward to seeing you again soon.',
            image: null
        },
        {
            id: 'revisit',
            title: 'Invite for Another Visit',
            description: 'Send a reminder after a specific number of days',
            icon: <FaCalendarAlt className="text-blue-500" />,
            enabled: false,
            message: 'We miss you! It\'s been a while since your last visit. Book your next appointment today!',
            image: null
        },
        {
            id: 'birthday',
            title: 'Birthday Discount',
            description: 'Offer special discounts on clients\' birthdays',
            icon: <FaBirthdayCake className="text-pink-500" />,
            enabled: false,
            message: 'Happy Birthday! Enjoy 15% off your next service as our gift to you on your special day.',
            image: null
        },
        {
            id: 'review',
            title: 'Review Reminder',
            description: 'Remind clients to leave a review after their visit',
            icon: <FaStar className="text-yellow-500" />,
            enabled: false,
            message: 'We value your feedback! Please take a moment to share your experience with us by leaving a review.',
            image: null
        },
        {
            id: 'inactive',
            title: 'Reactivation Offer',
            description: 'Offer discount for clients who haven\'t visited in 90 days',
            icon: <FaUserClock className="text-purple-500" />,
            enabled: false,
            message: 'We miss you! It\'s been 90 days since your last visit. Come back and enjoy 10% off your next service!',
            image: null
        }
    ]);

    const toggleAutomation = (id: string) => {
        setAutomations(automations.map(automation =>
            automation.id === id ? { ...automation, enabled: !automation.enabled } : automation
        ));
    };

    const updateMessage = (id: string, message: string) => {
        setAutomations(automations.map(automation =>
            automation.id === id ? { ...automation, message } : automation
        ));
    };

    const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAutomations(automations.map(automation =>
                    automation.id === id ? { ...automation, image: reader.result as string } : automation
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (id: string) => {
        setAutomations(automations.map(automation =>
            automation.id === id ? { ...automation, image: null } : automation
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
                duration: 0.3,
                ease: "easeInOut"
            }}
        >
            <div className="p-6">
                {!selectedAutomation && (
                    <button
                        onClick={close}
                        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
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

                {!selectedAutomation ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4">SMS Marketing Automation</h1>
                        <p className="text-gray-600 mb-6">Configure automated SMS messages to engage with your clients at key moments.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {automations.map((automation) => (
                                <div
                                    key={automation.id}
                                    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                                    onClick={() => setSelectedAutomation(automation.id)}
                                >
                                    {automation.enabled && (
                                        <div className="absolute top-3 right-3 flex items-center bg-green-50 px-2 py-1 rounded-full">
                                            <span className="text-xs font-medium text-green-700 bg-green-50 rounded-full px-2 py-1">Active</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        {automation.icon}
                                        <h3 className="text-lg sm:text-xl font-semibold">{automation.title}</h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600">{automation.description}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="relative">
                            {/* Back button */}
                            <button
                                onClick={() => setSelectedAutomation(null)}
                                className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
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
                                <span className="font-medium">Back</span>
                            </button>

                            {/* Header Section */}
                            <div className="border-b border-gray-200 p-4 sm:p-6 pt-16 sm:pt-20">
                                <div className="flex justify-end mb-4">
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => toggleAutomation(selectedAutomation)}
                                    >
                                        {automations.find(a => a.id === selectedAutomation)?.enabled ? (
                                            <FaToggleOn size={28} className="text-green-600" />
                                        ) : (
                                            <FaToggleOff size={28} className="text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {automations.find(a => a.id === selectedAutomation)?.title}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600 mt-1">
                                    {automations.find(a => a.id === selectedAutomation)?.description}
                                </p>
                            </div>

                            {/* Content Section */}
                            <div className="p-4 sm:p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Message Content
                                    </label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
                                        rows={4}
                                        value={automations.find(a => a.id === selectedAutomation)?.message || ''}
                                        onChange={(e) => updateMessage(selectedAutomation, e.target.value)}
                                        placeholder="Enter your message here..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Attachment Image
                                    </label>

                                    {automations.find(a => a.id === selectedAutomation)?.image ? (
                                        <div className="relative w-full h-40 sm:h-48 mb-2 rounded-lg overflow-hidden">
                                            <img
                                                src={automations.find(a => a.id === selectedAutomation)?.image || ''}
                                                alt="SMS attachment"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removeImage(selectedAutomation)}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                                                title="Remove image"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                                                    <FaImage className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 text-gray-400" />
                                                    <p className="mb-1 sm:mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-400">PNG, JPG or GIF (Max 2MB)</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(selectedAutomation, e)}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Status Footer */}
                                <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200">
                                    <span className="text-sm font-medium text-gray-600">
                                        Status: <span className={`${automations.find(a => a.id === selectedAutomation)?.enabled ? 'text-green-700' : 'text-gray-500'}`}>
                                            {automations.find(a => a.id === selectedAutomation)?.enabled ? 'Active' : 'Inactive'}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
