'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FiMail, FiMapPin, FiInstagram, FiFacebook, FiPhone } from 'react-icons/fi'
import { SiTiktok } from 'react-icons/si'

export default function Footer() {
  const socialLinks = [
    {
      icon: <FiInstagram className="h-5 w-5" />,
      name: 'Instagram',
      url: 'https://www.instagram.com/sofia.socialbae'
    },
    {
      icon: <FiFacebook className="h-5 w-5" />,
      name: 'Facebook',
      url: 'https://www.facebook.com/sofiang2407'
    },
    {
      icon: <SiTiktok className="h-5 w-5" />,
      name: 'TikTok',
      url: 'https://www.tiktok.com/@sofia.bossbae'
    }
  ]

  return (
    <footer className="bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/logo1.png"
              alt="Glaze Logo"
              width={320}
              height={40}
              className="h-auto"
            />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start gap-4"
          >
            <div className="flex items-center gap-2">
              <FiPhone className="text-[#FF6B35] h-5 w-5" />
              <a
                href="tel:+61424407427"
                className="text-black/80 hover:text-[#FF6B35] transition-colors"
              >
                +61 424 407 427
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="text-[#FF6B35] h-5 w-5" />
              <a
                href="mailto:sofiang2407@gmail.com"
                className="text-black/80 hover:text-[#FF6B35] transition-colors"
              >
                sofiang2407@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-[#FF6B35] h-5 w-5" />
              <span className="text-black/80">Hawthorn, Australia, VIC, 3123</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="https://colaunch-it.vercel.app/booking"
              className="inline-block bg-[#FF6B35] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-semibold"
            >
              Book Appointment
            </Link>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-4 mb-8"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF6B35] w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={link.name}
            >
              {link.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright - Bottom Center */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-black text-sm border-t border-[#FF6B35]/20 pt-6"
        >
          <p>© 2024 Glaze. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
