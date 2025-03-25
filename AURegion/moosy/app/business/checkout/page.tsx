"use client"; // Mark as client component
import { motion } from "framer-motion";
import Checkout from "./components/checkout";
import Link from "next/link";

export default function CheckoutPage() {

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
            <Checkout />
        </motion.div>
    );
}
