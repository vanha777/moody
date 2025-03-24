'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  const services = [
    {
      title: "Lashes",
      description: "Whether you prefer classic lashes for timeless elegance or hybrid lashes for a fuller, voluminous look, we've got you covered to enhance your natural beauty.",
      image: "/lashes.jpg"
    },
    {
      title: "Brow Shaping & Tinting",
      description: "Get perfectly shaped and tinted brows that beautifully frame your face.",
      image: "/brows2.png"
    },
    {
      title: "Facials",
      description: "Refresh and hydrate your skin with rejuvenating facials, leaving you with a glowing, radiant look.",
      image: "/facial.jpg"
    },
    {
      title: "Refill",
      description: "Revive your lashes with a quick, expert touch-up, restoring fullness and flair in no time!",
      image: "/refills.jpg"
    }
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* <section id="services" className="bg-white relative overflow-hidden min-h-screen py-10"> */}
        <section id="services" className="bg-gradient-to-r from-[#F8F4EA] to-[#F0EAD6] relative overflow-hidden min-h-screen py-10">
        <div className="container mx-auto relative z-10 px-4 md:px-8">
          <motion.p
            className="text-center text-[#D1B882] text-sm md:text-base font-semibold uppercase tracking-wider mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Premium Services
          </motion.p>

          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-8 mb-20`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Content */}
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-black whitespace-pre-line">
                    {service.title}
                  </span>
                </h2>
                <p className="text-black text-lg mb-8">
                  {service.description}
                </p>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative">
                  {/* Gradient background box */}
                  <div className="absolute inset-4 -rotate-6 rounded-[30px] bg-[#D1B882] transform hover:rotate-0 transition-transform duration-300">
                  </div>
                  
                  {/* Image container */}
                  <div className="relative p-6">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover rounded-[24px]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Centered Book Now button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="/pricing"
              rel="noopener noreferrer"
              className="bg-[#D1B882] text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#E2CA94]"
            >
              Our Services
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}