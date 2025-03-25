"use client"; // Mark as client component
import { motion } from "framer-motion";
import Checkout from "./components/checkout";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const bookingParam = searchParams.get("booking");
    const booking = bookingParam ? JSON.parse(decodeURIComponent(bookingParam)) as import('@/app/dashboard/components/booking').CalendarEvent : undefined;
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
            <Checkout booking={booking} />
        </motion.div>
    );
}
