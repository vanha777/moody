'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ContactProps } from '../../clients/components/businesses';
import { motion } from 'framer-motion';
import { XCircle, Mail } from 'lucide-react';
import { FaCheck, FaBellSlash } from 'react-icons/fa';
import { ServiceResponse } from '@/app/dashboard/login/page';
import { useAppContext } from '@/app/utils/AppContext';

interface PaymentMethodProps {
  amount: number;
  selectedServices: any[] | null;
  selectedDiscounts: any[] | null;
  customerInfo?: ContactProps | null;
  bookingId?: string | null;
  currencyId: string;
  onClose: () => void;
}

export default function PaymentMethods({
  amount,
  selectedServices,
  selectedDiscounts,
  customerInfo,
  bookingId,
  currencyId,
  onClose,
}: PaymentMethodProps) {
  const { auth, checkoutBooking, checkoutWalkin, sendEmail } = useAppContext();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showEmailOverlay, setShowEmailOverlay] = useState(false);
  const [email, setEmail] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    console.log("Payment Methods Customer Info: ", customerInfo);
    console.log("Payment Methods Booking ID: ", bookingId);
    console.log("Payment Methods Amount: ", amount);
    console.log("Payment Methods Currency ID: ", currencyId);
    console.log("Payment Methods Selected Services: ", selectedServices);
    console.log("Payment Methods Selected Discounts: ", selectedDiscounts);
  }, []);

  useEffect(() => {
    if (paymentStatus === 'completed') {
      setShowSuccessOverlay(true);
    }
  }, [paymentStatus]);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleBack = () => {
    // Handle navigation internally
    // You could use router.back() or router.push() here
    window.history.back();
  };

  const handlePaymentSubmit = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    setPaymentStatus('processing');
    try {
      if (bookingId) {
        if (!customerInfo) return;
        // checkout a booking
        const response = await checkoutBooking(
          customerInfo.id,
          amount,
          selectedMethod,
          currencyId,
          bookingId || undefined,
          selectedServices?.map(service => service.id),
          selectedDiscounts?.map(discount => discount.id)
        );
        console.log("Payment submit response ", response);
        setPaymentId(response.toString());
      }
      else {
        // process a payment without a booking
        const response = await checkoutWalkin(
          amount,
          selectedMethod,
          currencyId,
          customerInfo?.id,
          selectedServices?.map(service => service.id),
          selectedDiscounts?.map(discount => discount.id)
        );
        console.log("Payment walkin New customer response ", response);
      }
      setPaymentStatus('completed');
    } catch (error) {
      setPaymentStatus('error');
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    // Handle closing internally
    // You could redirect to home page or order confirmation page
    window.location.href = '/'; // Or use Next.js router
  };

  const handleSendEmail = () => {
    // Pre-fill email if customer info exists and has an email
    if (customerInfo?.email) {
      setEmail(customerInfo.email);
    }
    setShowEmailOverlay(true);
  };

  const handleEmailSubmit = async () => {
    if (!email) return;

    setIsSendingEmail(true);
    try {
      // Implement email sending logic here
      // This is a placeholder - you would need to connect this to your actual API
      // const response = await sendEmail(email, paymentId);
      const response = await sendEmail("vanha101096@gmail.com", paymentId);
      console.log("Email sent to:", response, paymentId);
      // Close the email overlay after sending
      setShowEmailOverlay(false);
    } catch (error) {
      console.error("Failed to send email:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: '/icons/credit-card.svg' },
    // { id: 'paypal', name: 'PayPal', icon: '/icons/paypal.svg' },
    { id: 'apple-pay', name: 'Apple Pay', icon: '/icons/apple-pay.svg' },
    { id: 'google-pay', name: 'Google Pay', icon: '/icons/google-pay.svg' },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: '/icons/bank.svg' },
    // { id: 'crypto', name: 'Cryptocurrency', icon: '/icons/crypto.svg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Add back button at the top */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-black"
        >
          <span>← Back</span>
        </button>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Select Payment Method</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${selectedMethod === method.id
                  ? 'border-black bg-gray-100'
                  : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className="w-12 h-12 relative mb-2">
                  {/* Fallback to div if image is not available */}
                  {method.icon ? (
                    <Image
                      src={method.icon}
                      alt={method.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs">{method.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-center">{method.name}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handlePaymentSubmit()}
            disabled={!selectedMethod || isProcessing}
            className={`relative w-full h-12 rounded-lg font-medium
              ${!selectedMethod || isProcessing
                ? 'btn btn-disabled'
                : 'btn bg-black text-white hover:bg-gray-800'
              }`}
          >
            {isProcessing ? (
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="ml-2">Processing...</span>
              </motion.div>
            ) : (
              'Complete Payment'
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 flex flex-col items-center justify-between">
            <div className="flex flex-col items-center text-center">
              <div className={`w-24 h-24 ${paymentStatus === 'completed' ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center mb-6`}>
                {paymentStatus === 'completed' ? (
                  <FaCheck className="text-white text-4xl" />
                ) : (
                  <XCircle className="text-white text-4xl" />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {paymentStatus === 'completed' ? 'Payment Successful!' : 'Payment Failed'}
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {paymentStatus === 'completed'
                  ? 'Your transaction has been completed successfully.'
                  : 'There was an issue processing your payment. Please try again.'}
              </p>

              {paymentStatus === 'completed' && (
                <button
                  onClick={handleSendEmail}
                  className="flex items-center justify-center bg-gray-100 text-black font-medium py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors w-full text-lg mb-4"
                >
                  <Mail className="mr-2" />
                  Send Receipt via Email
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setShowSuccessOverlay(false);
                if (paymentStatus === 'completed') {
                  handleClose();
                }
              }}
              className="bg-black text-white font-medium py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors w-full text-lg"
            >
              {paymentStatus === 'completed' ? 'Done' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      {/* Email Overlay */}
      {showEmailOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Send Receipt via Email</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEmailOverlay(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={!email || isSendingEmail}
                className={`flex-1 py-3 px-4 rounded-lg ${!email || isSendingEmail
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-black text-white hover:bg-gray-800'
                  } transition-colors`}
              >
                {isSendingEmail ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
