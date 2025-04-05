'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    console.log("this is mobile check", isMobile);
  }, [isMobile])

  return (
    // <section className="bg-white relative overflow-hidden min-h-screen flex items-center px-4 md:px-8 py-10">
      <section className="bg-white relative overflow-hidden min-h-screen flex items-center px-4 md:px-8 py-10">

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side content */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-[#3A3A3A]">EMBRACE</span>
              <br />
              <span className="text-[#3A3A3A]">
                BOLD BEAUTY
              </span>
            </h1>
            <p className="text-[#3A3A3A] text-lg mb-8">
              It's not just about longer lashes; it's about boosting your confidence and embracing self-love. Let us help you feel and look your best—inside and out!
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => window.open("https://moosy.vercel.app/booking/jess-glow", "_blank")}
                className="bg-[#D1B882] text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#E2CA94]"
              >
                Book Now
              </button>
            </motion.div>
          </motion.div>

          {/* Right side image */}
          <motion.div
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Gradient background box */}
            {/* <div className="absolute inset-4 -rotate-6 rounded-[30px] bg-[#D1B882] transform hover:rotate-0 transition-transform duration-300">
            </div> */}

            {/* Image container */}
            <div className="relative p-6">
              <img
                src={isMobile ? "/heroLashes.png" : "/heroLashes.png"}
                alt="Hero Image"
                className="w-full h-full object-cover rounded-[24px] border-4 border-[#D1B882]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}