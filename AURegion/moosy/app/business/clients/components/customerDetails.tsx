import React, { useState } from 'react';
import { ContactProps } from './businesses';
import AddCustomer from './addCustomer';
import { useAppContext } from '../../../utils/AppContext';

interface CustomerDetailsProps {
    customer: ContactProps;
    onClose: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onClose }) => {
    const { deleteCustomer } = useAppContext();
    const [showEditForm, setShowEditForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deleteCustomer(customer.id);
            console.log("Customer deleted response: ", response);
        } catch (error) {
            console.error('Error deleting customer:', error);
        } finally {
            setIsDeleting(false);
            onClose(); // Close the details view after successful deletion
        }
    };

    if (showEditForm) {
        console.log("This Is Customer Details: ", customer);
        return <AddCustomer onClose={() => {
            setShowEditForm(false)
            onClose()
        }} customer={customer} />;
    }

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* Header with back button */}
            <div className="sticky top-0 bg-white px-4 py-3 flex items-center border-b border-gray-200">
                <button
                    onClick={onClose}
                    className="text-black flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Profile section */}
            <div className="flex flex-col items-center py-8 px-4 bg-gray-50">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
                    {customer.avatar ? (
                        <img
                            src={customer.avatar}
                            alt={customer.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <h1 className="text-2xl font-bold text-center">{customer.name}</h1>
            </div>

            {/* Contact actions */}
            <div className="flex justify-center space-x-6 py-4 border-b border-gray-200">
                <button className="flex flex-col items-center text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm mt-1">Call</span>
                </button>
                <button className="flex flex-col items-center text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="text-sm mt-1">Message</span>
                </button>
                <button className="flex flex-col items-center text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm mt-1">Email</span>
                </button>
            </div>

            {/* Contact info */}
            <div className="px-4 py-2">
                <div className="py-3 border-b border-gray-200">
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="text-black">{customer.phone || 'Not provided'}</p>
                </div>
                <div className="py-3 border-b border-gray-200">
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-black">{customer.email}</p>
                </div>
                {customer.company && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Company</p>
                        <p className="text-black">{customer.company}</p>
                    </div>
                )}
                {customer.address && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Address</p>
                        <p>{customer.address.street}, {customer.address.city}, {customer.address.state}, {customer.address.postal_code}</p>
                    </div>
                )}
                {customer.lastContacted && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Last Contacted</p>
                        <p className="text-black">{customer.lastContacted}</p>
                    </div>
                )}
                {customer.lastVisited && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Last Visited</p>
                        <p className="text-black">{customer.lastVisited.toLocaleDateString()}</p>
                    </div>
                )}
                {customer.totalSpent !== undefined && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Total Spent</p>
                        <p className="text-black">${customer.totalSpent.toFixed(2)}</p>
                    </div>
                )}
                {customer.returns !== undefined && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Returns</p>
                        <p className="text-black">{customer.returns}</p>
                    </div>
                )}
                {customer.loyaltyPoints !== undefined && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Loyalty Points</p>
                        <p className="text-black">{customer.loyaltyPoints}</p>
                    </div>
                )}
                {customer.notes && (
                    <div className="py-3 border-b border-gray-200">
                        <p className="text-gray-500 text-sm">Notes</p>
                        <p>{customer.notes}</p>
                    </div>
                )}
            </div>

            {/* Purchase History - hidden on mobile */}
            {customer.purchaseHistory && customer.purchaseHistory.length > 0 && (
                <div className="px-4 py-2 hidden md:block">
                    <h2 className="text-lg font-semibold mb-3">Purchase History</h2>
                    <div className="space-y-3">
                        {customer.purchaseHistory.map((purchase, index) => (
                            <div key={index} className="border rounded-lg p-3">
                                <div className="flex justify-between">
                                    <p className="text-gray-500">{purchase.date.toLocaleDateString()}</p>
                                    <p className="font-medium">${purchase.amount.toFixed(2)}</p>
                                </div>
                                {purchase.items && purchase.items.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Items:</p>
                                        <p className="text-sm">{purchase.items.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit and Delete buttons */}
            <div className="px-4 py-6 space-y-3">
                <button
                    onClick={() => setShowEditForm(true)}
                    className="w-full py-2 bg-black text-white rounded-lg font-medium"
                >
                    Edit Contact
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`w-full py-2 text-black border border-black rounded-lg font-medium ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isDeleting ? 'Deleting...' : 'Delete Contact'}
                </button>
            </div>
        </div>
    );
};

export default CustomerDetails;
