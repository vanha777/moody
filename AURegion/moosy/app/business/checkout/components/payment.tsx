'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ContactProps } from '../../clients/components/businesses';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ServiceResponse } from '@/app/dashboard/login/page';
import { useAppContext } from '@/app/utils/AppContext';

interface PaymentMethodProps {
  amount: number;
  selectedServices: any[] | null;
  selectedDiscounts: any[] | null;
  customerInfo: ContactProps;
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
  const { auth, checkoutBooking, checkoutWalkin } = useAppContext();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');

  useEffect(() => {
    console.log("Payment Methods Customer Info: ", customerInfo);
    console.log("Payment Methods Booking ID: ", bookingId);
    console.log("Payment Methods Amount: ", amount);
    console.log("Payment Methods Currency ID: ", currencyId);
    console.log("Payment Methods Selected Services: ", selectedServices);
    console.log("Payment Methods Selected Discounts: ", selectedDiscounts);
  }, []);

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleBack = () => {
    // Handle navigation internally
    // You could use router.back() or router.push() here
    window.history.back();
  };

  const handlePaymentSubmit = async () => {
    if (!selectedMethod || !customerInfo) return;
    setIsProcessing(true);
    setPaymentStatus('processing');
    try {
      if (bookingId) {
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
        console.log("Payment booking response ", response);
      }
      else {
        // process a payment without a booking
        const response = await checkoutWalkin(
          customerInfo.id,
          amount,
          selectedMethod,
          currencyId,
          selectedServices?.map(service => service.id),
          selectedDiscounts?.map(discount => discount.id)
        );
        console.log("Payment walkin New customer response ", response);
      }

    } catch (error) {
      setPaymentStatus('error');
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
      setPaymentStatus('completed');
    }
  };

  const handleClose = () => {
    // Handle closing internally
    // You could redirect to home page or order confirmation page
    window.location.href = '/'; // Or use Next.js router
  };

  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: '/icons/credit-card.svg' },
    { id: 'paypal', name: 'PayPal', icon: '/icons/paypal.svg' },
    { id: 'apple-pay', name: 'Apple Pay', icon: '/icons/apple-pay.svg' },
    { id: 'google-pay', name: 'Google Pay', icon: '/icons/google-pay.svg' },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: '/icons/bank.svg' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '/icons/crypto.svg' },
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

          {/* Updated Payment Status and Actions Section */}
          {paymentStatus === 'completed' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <CheckCircle className="w-16 h-16 text-black mb-4" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold text-black mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your transaction has been completed
                </p>
                <button
                  onClick={handleClose}
                  className="btn btn-outline border-black text-black hover:bg-black hover:text-white btn-wide"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <>
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

              {paymentStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-gray-100 text-black p-4 rounded-lg border border-gray-300"
                >
                  Payment failed. Please try again.
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
