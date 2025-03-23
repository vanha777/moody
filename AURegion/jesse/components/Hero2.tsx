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
    <section className="bg-white relative overflow-hidden min-h-screen flex items-center px-4 md:px-8 py-10">
      {/* <section className="bg-gradient-to-r from-[#F8F4EA] to-[#F0EAD6] relative overflow-hidden min-h-screen flex items-center px-4 md:px-8 py-10"> */}
      {/* Animated gradient background */}
      {/* <div className="absolute inset-0"> */}
      {/* Glowing orbs */}
      {/* <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600 rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600 rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600 rounded-full filter blur-[150px] opacity-20" /> */}

      {/* Diagonal lines pattern */}
      {/* <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`h-${i}`}
              initial={{ opacity: 0.1 }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
                height: ['1px', '2px', '1px']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{ 
                top: `${(i + 1) * 5}%`,
                transform: 'rotate(-45deg)',
                transformOrigin: 'center'
              }}
              className="absolute w-full bg-violet-500/30"
            />
          ))}
        </div> */}
      {/* </div> */}

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
                onClick={() => window.open("https://colaunch-it.vercel.app/booking", "_blank")}
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
            <div className="rounded-[30px] overflow-hidden shadow-lg aspect-square">
              <img
                src={isMobile ? "/hero.jpg" : "/hero.jpg"}
                alt="Hero Image"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}