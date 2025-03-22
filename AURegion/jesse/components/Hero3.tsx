'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  const services = [
    {
      title: "Manicures & Pedicures",
      description: "Keep your nails looking fresh and flawless. Want perfectly polished nails?",
      image: "/manicure.jpg"
    },
    {
      title: "Acrylic & Gel Extensions",
      description: "Get longer, stronger, and more stylish nails. Want stunning nail extensions?",
      image: "/extension.jpg"
    },
    {
      title: "Nail Art & Designs",
      description: "Express yourself with custom nail art. Want unique, eye-catching designs?",
      image: "/design.jpg"
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
      <section id="services" className="bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] relative overflow-hidden min-h-screen py-10">
        <div className="container mx-auto relative z-10 px-4 md:px-8">
          <motion.p
            className="text-center text-[#FF6B35] text-sm md:text-base font-semibold uppercase tracking-wider mb-12"
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
                <div className="rounded-[30px] overflow-hidden shadow-lg aspect-square">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Centered Book Now button */}
          <div className="flex justify-center mt-8">
            <motion.a
              href="/pricing"
              // target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FF6B35] text-white px-10 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 text-xl font-bold shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Pricing
            </motion.a>
          </div>
        </div>
      </section>
    </>
  )
}