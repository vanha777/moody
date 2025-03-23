'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function NavBar() {
    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="w-full z-50 bg-[#F8D7D2]"
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
                        <ul tabIndex={0} className="menu menu-sm dropdown-content z-50 mt-3 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] rounded-box w-52 p-2 shadow text-lg">
                            <li>
                                <Link href="/" className="font-medium">Home</Link>
                            </li>
                            <li>
                                <Link href="/about" className="font-medium">About</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="font-medium">Pricing</Link>
                            </li>
                            <li>
                                <Link href="/#location" className="font-medium">Contact</Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo1.png"
                            alt="MetaLoot Logo"
                            width={150}
                            height={150}
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
                            <Link href="/pricing" className="text-black hover:text-black transition-colors font-medium text-lg">
                                Pricing
                            </Link>
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
                        href="https://colaunch-it.vercel.app/booking"
                        rel="noopener noreferrer"
                        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
