"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import ContactList, { ContactProps } from "@/app/business/clients/components/businesses";
import PaymentMethods from "./payment";
import ServiceSelector, { ServiceData } from "./service";
import Link from "next/link";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Client {
    id: string;
    name: string;
    email: string;
}

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

export default function Checkout() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<ContactProps | null>(null);
    const [amount, setAmount] = useState<number>(0);
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
        setShowOverall(false);
    };

    return (
        <div className="h-screen bg-gray-50">
            {showOverall && !showContactModal && !showServiceModal && (
                <>
                    {/* Header with back button and title aligned */}
                    <div className="bg-white px-4 py-6 shadow-sm">
                        <div className="flex items-center justify-start max-w-3xl mx-auto">
                            <Link
                                href="/business"
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

                    {/* Main Content with Order Summary */}
                    <div className="h-[calc(100vh-80px)] overflow-y-auto p-4">
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                            {/* Client Section */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Client</h3>
                                    <button
                                        onClick={() => setShowContactModal(true)}
                                        className="text-black text-sm hover:text-gray-700"
                                    >
                                        {selectedClient ? 'Change Client' : '+ Add Client'}
                                    </button>
                                </div>
                                {selectedClient ? (
                                    <div className="mt-2 p-2 bg-gray-50 rounded">
                                        <p>{selectedClient.name}</p>
                                        <p className="text-sm text-gray-500">{selectedClient.email}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-2">No client selected</p>
                                )}
                            </div>

                            {/* Services Section */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Services</h3>
                                    <button
                                        onClick={() => setShowServiceModal(true)}
                                        className="text-blue-600 text-sm"
                                    >
                                        + Add Service
                                    </button>
                                </div>
                                {selectedServices.length > 0 ? (
                                    <div className="mt-2 space-y-2">
                                        {selectedServices.map(service => (
                                            <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded group">
                                                <span>{service.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span>${service.price}</span>
                                                    <button
                                                        onClick={() => handleRemoveService(service.id)}
                                                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="#00000">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-2">No services selected</p>
                                )}
                            </div>

                            {/* Total Amount */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total Amount:</span>
                                    <span className="text-xl font-bold">${amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            {showContactModal && (
                <ContactList
                    onContactSelect={handleClientSelect}
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
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
                    <div className="flex justify-center items-center">
                        <button
                            onClick={handleProceedToPayment}
                            disabled={!selectedClient || selectedServices.length === 0}
                            className="w-full bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-300"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            )}

            {/* Payment view */}
            {!showOverall && (
                <PaymentMethods
                    amount={amount}
                    selectedServices={selectedServices}
                    selectedDiscounts={selectedDiscounts}
                    customerInfo={selectedClient}
                    onClose={() => setShowOverall(true)}
                />
            )}
        </div>
    );
}
