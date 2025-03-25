"use client"; // Mark as client component
import Checkout from "./components/checkout";
import Link from "next/link";


interface CheckoutPageProps {
    productId?: string;
    planId?: string;
    businessId?: string;
}

export default function CheckoutPage({ productId, planId, businessId }: CheckoutPageProps) {

    return (
        <>
            <Checkout />
        </>
    );
}
