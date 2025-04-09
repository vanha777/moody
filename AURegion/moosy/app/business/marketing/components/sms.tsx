'use client'
import { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff, FaCheck, FaCalendarAlt, FaBirthdayCake, FaStar, FaUserClock, FaBellSlash } from 'react-icons/fa';
import SimpleSideBar from "@/app/dashboard/components/simpleSideBar";
import { motion } from 'framer-motion';
import { useAppContext } from '@/app/utils/AppContext';
interface SmsAutomation {
    id: string;
    name: string;
    description: string;
    trigger_frequency: number;
    message_template: string;
    active: boolean;
    type: string;
    features: Array<{
        feature_id: string;
        feature_name: string;
        feature_description: string;
        feature_cap: number;
        usage: number;
    }> | null;
    icon?: React.ReactNode;
    image?: string | null;
}

export default function SmsMarketing({
    close,
    initialAutomations
}: {
    close: () => void;
    initialAutomations?: SmsAutomation[];
}) {
    const { auth, updateCampaign } = useAppContext();
    const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [isActivation, setIsActivation] = useState(true);
    const [automations, setAutomations] = useState<SmsAutomation[]>(initialAutomations || [
        {
            id: 'welcome',
            name: 'Welcome Message',
            description: 'Say hi to every client after their first two bookings',
            icon: <FaCheck className="text-green-500" />,
            active: false,
            message_template: 'Thank you for choosing our services! We hope you enjoyed your experience and look forward to seeing you again soon.',
            trigger_frequency: 2,
            type: 'welcome',
            features: null,
            image: null
        },
        {
            id: 'revisit',
            name: 'Invite for Another Visit',
            description: 'Send a reminder after a specific number of days',
            icon: <FaCalendarAlt className="text-blue-500" />,
            active: false,
            message_template: 'We miss you! It\'s been a while since your last visit. Book your next appointment today!',
            trigger_frequency: 30,
            type: 'revisit',
            features: null,
            image: null
        },
        {
            id: 'birthday',
            name: 'Birthday Discount',
            description: 'Offer special discounts on clients\' birthdays',
            icon: <FaBirthdayCake className="text-pink-500" />,
            active: false,
            message_template: 'Happy Birthday! Enjoy 15% off your next service as our gift to you on your special day.',
            trigger_frequency: 1,
            type: 'birthday',
            features: null,
            image: null
        },
        {
            id: 'review',
            name: 'Review Reminder',
            description: 'Remind clients to leave a review after their visit',
            icon: <FaStar className="text-yellow-500" />,
            active: false,
            message_template: 'We value your feedback! Please take a moment to share your experience with us by leaving a review.',
            trigger_frequency: 1,
            type: 'review',
            features: null,
            image: null
        },
        {
            id: 'inactive',
            name: 'Reactivation Offer',
            description: 'Offer discount for clients who haven\'t visited in 90 days',
            icon: <FaUserClock className="text-purple-500" />,
            active: false,
            message_template: 'We miss you! It\'s been 90 days since your last visit. Come back and enjoy 10% off your next service!',
            trigger_frequency: 90,
            type: 'inactive',
            features: null,
            image: null
        }
    ]);

    // Add useEffect to update automations when initialAutomations changes
    useEffect(() => {
        if (initialAutomations) {
            setAutomations(initialAutomations);
        }
    }, [initialAutomations]);

    const toggleAutomation = async (id: string, active: boolean) => {
        try {
            const isCurrentlyActive = automations.find(a => a.id === id)?.active;
            const response = await updateCampaign(id, !isCurrentlyActive);
            console.log("Campaign updated At:", response);
            
            // Show overlay for both activation and deactivation
            setIsActivation(!isCurrentlyActive);
            setShowSuccessOverlay(true);
        } catch (error) {
            console.log("Error updating campaign:", error);
        }
    };

    // const updateMessage = (id: string, message: string) => {
    //     setAutomations(automations.map(automation =>
    //         automation.id === id ? { ...automation, message_template: message } : automation
    //     ));
    // };

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
            {showSuccessOverlay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 flex flex-col items-center justify-between">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-24 h-24 ${isActivation ? 'bg-green-500' : 'bg-gray-500'} rounded-full flex items-center justify-center mb-6`}>
                                {isActivation ? (
                                    <FaCheck className="text-white text-4xl" />
                                ) : (
                                    <FaBellSlash className="text-white text-4xl" />
                                )}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                {isActivation ? 'Message Activated' : 'Message Deactivated'}
                            </h3>
                            <p className="text-gray-600 mb-8 text-lg">
                                {isActivation ? 
                                    'Moosy will send this message automatically to your client via SMS every time a booking is made.' :
                                    'Moosy will no longer send this automated message to your clients.'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowSuccessOverlay(false)}
                            className="bg-black text-white font-medium py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors w-full text-lg"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
            <div className={`${selectedAutomation ? 'fixed inset-0 bg-white z-40' : 'p-6'}`}>
                {!selectedAutomation && (
                    <div className="bg-white px-4 py-6 border-b mb-6">
                        <div className="flex items-center justify-start max-w-3xl mx-auto">
                            <button
                                onClick={close}
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
                            <h1 className="text-2xl font-semibold text-black">
                                SMS Marketing Automation
                            </h1>
                        </div>
                    </div>
                )}

                {!selectedAutomation ? (
                    <>
                        <p className="text-gray-600 mb-6">Configure automated SMS messages to engage with your clients at key moments.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {automations.map((automation) => (
                                <div
                                    key={automation.id}
                                    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
                                    onClick={() => setSelectedAutomation(automation.id)}
                                >
                                    {automation.active && (
                                        <div className="absolute top-3 right-3 flex items-center bg-green-50 px-2 py-1 rounded-full">
                                            <span className="text-xs font-medium text-green-700 bg-green-50 rounded-full px-2 py-1">Active</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        {automation.icon}
                                        <h3 className="text-lg sm:text-xl font-semibold">{automation.name}</h3>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600">{automation.description}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col">
                        {/* Checkout-style header */}
                        <div className="bg-white px-4 py-6 border-b">
                            <div className="flex items-center justify-start max-w-3xl mx-auto">
                                <button
                                    onClick={() => setSelectedAutomation(null)}
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
                                <h1 className="text-2xl font-semibold text-black">
                                    Message Details
                                </h1>
                            </div>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 space-y-6">
                                {/* Title and description */}
                                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {automations.find(a => a.id === selectedAutomation)?.name}
                                            </h2>
                                            <p className="text-gray-600 mt-1">
                                                {automations.find(a => a.id === selectedAutomation)?.description}
                                            </p>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => toggleAutomation(selectedAutomation, !automations.find(a => a.id === selectedAutomation)?.active)}
                                        >
                                            {automations.find(a => a.id === selectedAutomation)?.active ? (
                                                <FaToggleOn size={46} color='green' />
                                            ) : (
                                                <FaToggleOff size={46} color='gray' />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Message content */}
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <label className="block text-xl font-bold text-gray-900 mb-2">
                                        Message Content
                                    </label>
                                    <hr className="border-t border-gray-200 my-3" />
                                    <div className="text-gray-800 leading-relaxed">
                                        {automations.find(a => a.id === selectedAutomation)?.message_template.split('.').map((sentence, index, array) => (
                                            sentence.trim() && index < array.length - 1 ? (
                                                <p key={index} className="mb-3">{sentence.trim() + '.'}</p>
                                            ) : sentence.trim() ? (
                                                <p key={index}>{sentence.trim()}</p>
                                            ) : null
                                        ))}
                                    </div>
                                    <hr className="border-t border-gray-200 mt-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

