'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function PricingHero() {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const services = [
    {
      title: "Manicures & Pedicures",
      description: "Keep your nails looking fresh and flawless. Want perfectly polished nails?",
      image: "/manicure.jpg",
      subServices: [
        {
          name: "Classic Manicure",
          description: "Includes nail shaping, cuticle care, hand massage, and polish",
          price: 35,
          duration: "45 min"
        },
        {
          name: "Spa Pedicure",
          description: "Luxurious foot treatment with scrub, massage, and polish",
          price: 45,
          duration: "60 min"
        },
        {
          name: "Gel Polish",
          description: "Long-lasting, chip-free polish that stays perfect for weeks",
          price: 40,
          duration: "45 min"
        }
      ]
    },
    {
      title: "Acrylic & Gel Extensions",
      description: "Get longer, stronger, and more stylish nails. Want stunning nail extensions?",
      image: "/extension.jpg",
      subServices: [
        {
          name: "Full Set Acrylics",
          description: "Custom-length acrylic extensions with your choice of design",
          price: 75,
          duration: "90 min"
        },
        {
          name: "Gel Extensions",
          description: "Natural-looking gel nail extensions for added length and strength",
          price: 85,
          duration: "90 min"
        },
        {
          name: "Fill-ins",
          description: "Maintenance service to keep your extensions looking fresh",
          price: 45,
          duration: "60 min"
        }
      ]
    },
    {
      title: "Nail Art & Designs",
      description: "Express yourself with custom nail art. Want unique, eye-catching designs?",
      image: "/design.jpg",
      subServices: [
        {
          name: "Basic Gel Polish",
          description: "Single color gel polish application with high shine finish",
          price: 40,
          duration: "45 min"
        },
        {
          name: "French Gel Tips",
          description: "Classic French manicure style with gel polish",
          price: 50,
          duration: "60 min"
        },
        {
          name: "Gel Art Design",
          description: "Custom nail art with gel polish and decorative elements",
          price: 65,
          duration: "75 min"
        },
        {
          name: "Chrome/Cat Eye",
          description: "Specialty gel polish effects for a unique shine",
          price: 55,
          duration: "60 min"
        }
      ]
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
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold  my-32 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-black">Our</span>{' '}
            <span className="text-[#FF6B35]">Premium Services</span>
          </motion.h1>

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

                {/* Sub-services */}
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {service.subServices?.map((subService, idx) => (
                    <motion.div
                      key={subService.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      onClick={() => setExpandedService(expandedService === subService.name ? null : subService.name)}
                      className="backdrop-blur-sm rounded-lg p-5 hover:bg-white/70 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border-b border-[#FF6B35]/10"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#FF6B35] mb-1">
                            {subService.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            {subService.duration}
                          </span>
                          <div className="h-[1px] w-12 bg-[#FF6B35]/30 hidden sm:block" />
                          <span className="text-xl font-semibold text-gray-900">
                            ${subService.price}
                          </span>
                        </div>
                      </div>
                      {/* Description dropdown */}
                      {expandedService === subService.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 text-gray-600"
                        >
                          {subService.description}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <a
                  href="https://colaunch-it.vercel.app/booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#FF6B35] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-semibold"
                >
                  Book Now
                </a>
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
        </div>
      </section>
    </>
  )
}