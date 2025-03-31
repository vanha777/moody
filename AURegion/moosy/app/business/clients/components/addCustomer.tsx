import React, { useState } from 'react';
import { ContactProps } from './businesses';

interface AddCustomerProps {
    onClose: () => void;
    // onSave: (customer: ContactProps) => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<Partial<ContactProps>>({});
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // onSave(formData as ContactProps);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setFormData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
            {/* Header with back button */}
            <div className="sticky top-0 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-50">
                <button
                    onClick={onClose}
                    className="text-black flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cancel
                </button>
                <h1 className="text-lg font-semibold">Add New Customer</h1>
                <div className="w-20"></div> {/* Spacer for centering */}
            </div>

            <form onSubmit={handleSubmit} className="p-4">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-4 z-0">
                    <div className="relative w-24 h-24 mb-2">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <span className="text-sm text-gray-500">Add photo</span>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Name*</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Email*</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Company</label>
                        <input
                            type="text"
                            name="company"
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Address Fields */}
                    <div className="space-y-2">
                        <label className="block text-sm text-gray-500">Address</label>
                        <input
                            type="text"
                            name="address.street"
                            placeholder="Street"
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            onChange={handleChange}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                name="address.city"
                                placeholder="City"
                                className="p-2 border border-gray-200 rounded-lg"
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="address.state"
                                placeholder="State"
                                className="p-2 border border-gray-200 rounded-lg"
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            type="text"
                            name="address.zip"
                            placeholder="ZIP Code"
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Notes</label>
                        <textarea
                            name="notes"
                            className="w-full p-2 border border-gray-200 rounded-lg"
                            rows={3}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full py-2 bg-black text-white rounded-lg font-medium"
                    >
                        Save Customer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCustomer;
