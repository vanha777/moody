'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function NavBar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-pink-200 shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/transLogo.png"
                            alt="MetaLoot Logo"
                            width={182}
                            height={182}
                        />
                        {/* <span className="text-xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">
                            Mood
                        </span> */}
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <span className="text-xl font-bold font-serif italic text-black">
                            "Let’s take your business to the next level."
                        </span>
                        {/* <Link href="about" className="text-gray-600 hover:text-pink-500 transition-colors">
                            About
                        </Link>
                        <Link href="pricing" className="text-gray-600 hover:text-pink-500 transition-colors">
                            Pricing
                        </Link>
                        <Link
                            href="https://documenter.getpostman.com/view/29604463/2sAYQXnsMR"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-pink-500 transition-colors"
                        >
                            Docs
                        </Link>
                        <Link href="contact" className="text-gray-600 hover:text-pink-500 transition-colors">
                            Support
                        </Link> */}
                    </div>

                    {/* CTA Button */}
                    <div>
                        <Link
                            href="https://calendly.com/sofiang2407/30min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-[#FF69B4] to-[#FFD700] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                        >
                            Let's Chat
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}
