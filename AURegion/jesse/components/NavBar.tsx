'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function NavBar() {
    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="w-full z-50 bg-[#F8D7D2] border-b-2 border-[#D1B882]"
        >
            <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="navbar-start">
                    {/* Mobile Menu */}
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content z-50 mt-3 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] rounded-box w-52 p-2 shadow text-lg border border-[#D1B882]">
                            <li>
                                <Link href="/" className="font-medium">Home</Link>
                            </li>
                            <li>
                                <Link href="/about" className="font-medium">About</Link>
                            </li>
                            <li>
                                <details>
                                    <summary className="font-medium">Services</summary>
                                    <ul className="p-2 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] rounded-md border border-[#D1B882]">
                                        <li><Link href="/services/lashes&refill" className="font-medium">Lashes & Refill</Link></li>
                                        <li><Link href="/services/brow&tint" className="font-medium">Brow & Lint</Link></li>
                                        <li><Link href="/services/facials" className="font-medium">Facials</Link></li>
                                        <li><Link href="/services/lift" className="font-medium">Lift</Link></li>
                                    </ul>
                                </details>
                            </li>
                            <li>
                                <Link href="/#location" className="font-medium">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/xxxx.png"
                            alt="Jess Glow Logo"
                            width={250}
                            height={250}
                        />
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link href="/" className="text-black hover:text-black transition-colors font-medium text-lg">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="text-black hover:text-black transition-colors font-medium text-lg">
                                About
                            </Link>
                        </li>
                        <li>
                            <details>
                                <summary className="text-black hover:text-black transition-colors font-medium text-lg">Services</summary>
                                <ul className="p-2 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] rounded-md border border-[#D1B882] z-50">
                                    <li><Link href="/services/lashes&refill" className="text-black font-medium">Lashes & Refill</Link></li>
                                    <li><Link href="/services/brow&lint" className="text-black font-medium">Brow & Lint</Link></li>
                                    <li><Link href="/services/facials" className="text-black font-medium">Facials</Link></li>
                                    <li><Link href="/services/lift" className="text-black font-medium">Lift</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <Link href="/#location" className="text-black hover:text-black transition-colors font-medium text-lg">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* CTA Button */}
                <div className="navbar-end">
                    <Link
                        href="https://colaunch-it.vercel.app/booking/jess-glow"
                        rel="noopener noreferrer"
                        className="bg-[#D1B882] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md hover:shadow-lg hover:bg-[#E2CA94]"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
