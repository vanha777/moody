"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import ContactList, { ContactProps } from "@/app/business/clients/components/businesses";
import PaymentMethods from "./payment";
import ServiceSelector, { ServiceData } from "./service";
import Link from "next/link";
import { CalendarEvent } from "@/app/dashboard/components/booking";
import { useAppContext } from "@/app/utils/AppContext";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);



interface Service {
    id: string;
    name: string;
    price: number;
}

interface Discount {
    id: string;
    name: string;
    percentage: number;
}

export default function Checkout({ booking }: { booking?: CalendarEvent }) {
    const { auth } = useAppContext();
    const [selectedClient, setSelectedClient] = useState<ContactProps | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [isEditingAmount, setIsEditingAmount] = useState<boolean>(false);
    const [services, setServices] = useState<ServiceData[]>([]);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
    const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false);
    const [showContactModal, setShowContactModal] = useState<boolean>(false);
    const [showOverall, setShowOverall] = useState<boolean>(true);

    // Fetch clients, services, and discounts on component mount
        //   useEffect(() => {

        //   }, []);

    useEffect(() => {
        if (booking) {
            setSelectedClient(booking.customer);
            setSelectedServices([booking.service]);
        }
    }, [booking]);

    // Calculate total amount based on services and discounts
    useEffect(() => {
        const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
        const discountPercentage = selectedDiscounts.reduce((sum, discount) => sum + discount.percentage, 0);
        const discountAmount = (servicesTotal * discountPercentage) / 100;
        setAmount(servicesTotal - discountAmount);
    }, [selectedServices, selectedDiscounts]);

    const handleClientSelect = (client: ContactProps) => {
        setSelectedClient(client);
        setShowContactModal(false);
    };

    const handleServicesConfirm = (services: Service[]) => {
        setSelectedServices(services);
        const servicesTotal = services.reduce((sum, service) => sum + service.price, 0);
        setAmount(servicesTotal);
    };

    const handleAddService = (service: Service) => {
        setSelectedServices([...selectedServices, service]);
        setShowServiceModal(false);
    };

    const handleAddDiscount = (discount: Discount) => {
        setSelectedDiscounts([...selectedDiscounts, discount]);
        setShowDiscountModal(false);
    };

    const handleRemoveService = (serviceId: string) => {
        setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
    };

    const handleRemoveDiscount = (discountId: string) => {
        setSelectedDiscounts(selectedDiscounts.filter(discount => discount.id !== discountId));
    };

    const handleProceedToPayment = () => {
        // console.log("Proceed to Payment: ", selectedClient, selectedServices, selectedDiscounts, amount,booking);
        setShowOverall(false);
    };

    const handleAddCustomService = () => {
        if (customAmount && parseFloat(customAmount) > 0) {
            const customService: Service = {
                id: `custom-${Date.now()}`,
                name: "Custom Service",
                price: parseFloat(customAmount)
            };
            setSelectedServices([...selectedServices, customService]);
            setCustomAmount("");
            setIsEditingAmount(false);
        }
    };

    const handleCustomAmountKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddCustomService();
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {showOverall && !showContactModal && !showServiceModal && (
                <>
                    {/* Header */}
                    <div className="bg-white px-4 py-6 border-b">
                        <div className="flex items-center justify-start max-w-3xl mx-auto">
                            <Link
                                href="/"
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
                            </Link>
                            <h1 className="text-xl font-semibold text-black">Checkout</h1>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
                        {/* Client Selection Box */}
                        <div 
                            onClick={() => setShowContactModal(true)}
                            className="p-4 border-2 rounded-xl cursor-pointer hover:border-gray-400"
                        >
                            {selectedClient ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            {selectedClient.avatar ? (
                                                <img 
                                                    src={selectedClient.avatar} 
                                                    alt={selectedClient.email}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-lg font-semibold">
                                                    {selectedClient.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{selectedClient.name}</p>
                                            <p className="text-sm text-gray-500">{selectedClient.email}</p>
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

                        {/* Total Amount Box */}
                        <div className="p-4 border-2 rounded-xl bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-2xl font-bold mr-2">$</span>
                                    {selectedServices.length === 0 && isEditingAmount ? (
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            onKeyDown={handleCustomAmountKeyDown}
                                            onBlur={handleAddCustomService}
                                            autoFocus
                                            className="text-3xl font-bold bg-transparent outline-none w-32"
                                            placeholder="0.00"
                                        />
                                    ) : (
                                        <span 
                                            className="text-3xl font-bold cursor-pointer"
                                            onClick={() => {
                                                if (selectedServices.length === 0) {
                                                    setIsEditingAmount(true);
                                                    setCustomAmount(amount.toString());
                                                }
                                            }}
                                        >{amount}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowServiceModal(true)}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm"
                                >
                                    Add Service
                                </button>
                            </div>
                        </div>

                        {/* Services List */}
                        <div className="space-y-3">
                            {selectedServices.length > 0 ? (
                                selectedServices.map(service => (
                                    <div 
                                        key={service.id} 
                                        className="p-4 border-2 rounded-xl flex items-center justify-between group hover:border-gray-400"
                                    >
                                        <span className="font-medium">{service.name}</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-bold">${service.price}</span>
                                            <button
                                                onClick={() => handleRemoveService(service.id)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No services selected
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            {showContactModal && (
                <ContactList
                    onContactSelect={handleClientSelect}
                    onClose={() => setShowContactModal(false)}
                />
            )}

            {showServiceModal && (
                <ServiceSelector
                    onSelectService={handleAddService}
                    isOpen={showServiceModal}
                    onClose={() => setShowServiceModal(false)}
                />
            )}

            {/* Bottom action bar */}
            {showOverall && !showContactModal && !showServiceModal && (
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={handleProceedToPayment}
                            disabled={!selectedClient || selectedServices.length === 0}
                            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            )}

            {/* Payment view */}
            {!showOverall && auth && selectedClient && (
                <PaymentMethods
                    amount={amount}
                    selectedServices={selectedServices}
                    selectedDiscounts={selectedDiscounts}
                    customerInfo={selectedClient}
                    bookingId={booking?.id}
                    currencyId={auth.company.currency.id}
                    onClose={() => setShowOverall(true)}
                />
            )}
        </div>
    );
}
