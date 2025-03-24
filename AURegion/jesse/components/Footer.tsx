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
    <footer className="bg-[#F8D7D2] relative overflow-hidden border-t-2 border-[#D1B882]">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/x.png"
              alt="Jess Glow Logo"
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
              <FiPhone className="text-black h-5 w-5" />
              <a
                href="tel:+61413659869"
                className="text-black/80 hover:text-black transition-colors font-medium"
              >
                +61 413 659 869
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="text-black h-5 w-5" />
              <a
                href="mailto:Jessglow.jg@gmail.com"
                className="text-black/80 hover:text-black transition-colors font-medium"
              >
                Jessglow.jg@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-black h-5 w-5" />
              <a
                href="https://maps.app.goo.gl/WsgcUrhmE1vPuiX8A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/80 hover:text-black transition-colors font-medium"
              >
                12 Marchant Way, Morley WA 6062
              </a>
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
              className="inline-block bg-[#D1B882] text-white px-8 py-3 rounded-full hover:bg-[#E2CA94] transition-all duration-300 text-lg font-semibold"
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
              className="bg-[#D1B882] w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-[#E2CA94] transition-all"
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
          className="text-center text-black text-sm border-t border-[#D1B882] pt-6"
        >
          <p>© 2025 Jess Glow. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
