'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Demo() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="relative overflow-hidden flex items-center justify-center px-2 md:px-4 text-gray-800 py-24">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[#1a0b2e]">
        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7928CA] rounded-full filter blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF0080] rounded-full filter blur-[120px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0070F3] rounded-full filter blur-[150px] opacity-30" />

        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E1065]/90 via-[#4C1D95]/80 to-[#5B21B6]/70" />

        {/* Subtle grid overlay */}
        {/* <div className="absolute inset-0 bg-[url('/grid.png')] opacity-40 bg-repeat bg-center" 
             style={{ backgroundSize: '50px 50px' }} /> */}
      </div>

      <motion.div
        className="w-full max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-black/20 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border border-white/10">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative h-[300px] md:h-auto">
              <Image
                src="/demos.jpeg"
                alt="Demo Game Preview"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">
                Want More Clients? Let’s Make It Happen
              </h2>
              <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                Schedule a Call Today.
              </p>
              <a
                href="https://calendly.com/sofiang2407/30min"
                target="_blank" className="bg-gradient-to-r from-[#FF69B4] to-[#FFD700] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity w-fit">
                Let’s Chat
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
