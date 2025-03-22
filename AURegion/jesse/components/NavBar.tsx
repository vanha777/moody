'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function NavBar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="top-0 w-full z-50 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo1.png"
                            alt="MetaLoot Logo"
                            width={182}
                            height={182}
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-black hover:text-[#FF6B35] transition-colors font-medium">
                            Home
                        </Link>
                        <Link href="/about" className="text-black hover:text-[#FF6B35] transition-colors font-medium">
                            About
                        </Link>
                        <Link href="/pricing" className="text-black hover:text-[#FF6B35] transition-colors font-medium">
                            Pricing
                        </Link>
                        <Link href="/#location" className="text-black hover:text-[#FF6B35] transition-colors font-medium">
                            Contact
                        </Link>
                    </div>

                    {/* CTA Button */}
                    <div>
                        <Link
                            href="https://colaunch-it.vercel.app/booking"
                            rel="noopener noreferrer"
                            className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
