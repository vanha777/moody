'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-400 rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-400 rounded-full filter blur-[120px] opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/transLogo.png"
              alt="CreativeMood Logo"
              width={320}
              height={40}
              className="h-auto"
            />
          </motion.div>

          {/* Quote */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl font-serif italic text-gray-800 hidden md:block"
          >
            "Let’s take your business to the next level."
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="https://calendly.com/sofiang2407/30min"
              target="_blank"
              className="inline-block bg-gradient-to-r from-[#FF69B4] to-[#FFD700] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
            >
              Let’s Chat
            </Link>
          </motion.div>
        </div>

        {/* Copyright - Bottom Center */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-600 text-sm mt-6 border-t border-gray-200 pt-4"
        >
          <p>© 2024 CreativeMood. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
