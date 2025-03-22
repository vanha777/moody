'use client'

import { motion } from 'framer-motion'
import { FaAdversal, FaCalendarCheck, FaInstagram, FaLaptopCode, FaPalette, FaSearchLocation } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function Statements() {
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
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  const cards = [
    {
      title: "No Time to Waste",
      description: "Always busy with manual tasks like booking, rescheduling appointments, and following up with customers?",
      icon: FaLaptopCode,
    },
    {
      title: "Dinosaur in Tech?",
      description: "Struggling to keep up with technology? What is AI? What is automation?",
      icon: FaSearchLocation,
    },
    {
      title: "Scaling Problems?",
      description: "Getting busier but not making more money?",
      icon: FaCalendarCheck,
    },
  ];
  
  
  return (
    <section className="bg-white relative overflow-hidden flex items-center justify-center px-2 md:px-4 text-gray-800 py-24">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0">
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
              className="absolute w-full bg-violet-300/30"
            />
          ))}
        </div>
      </div>

      <motion.div
        className="w-full relative z-10 px-4 md:px-8 lg:px-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-32 mt-32">
          <span className="bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent relative">
            IS THIS YOU ?
            <motion.div 
              className="absolute left-1/2 -bottom-4 h-0.5 w-24 bg-black rounded-full -translate-x-1/2"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 96, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                delay: 0.2
              }}
            />
          </span>
        </h1>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-8'} w-full max-w-6xl mx-auto`}>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col gap-8 bg-white/80 backdrop-blur-lg rounded-xl p-10 border-2 border-pink-200 hover:border-pink-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative pt-4">
                {/* Sparkles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute w-1.5 h-1.5 bg-gradient-to-r from-pink-300 to-yellow-300 rounded-full"
                    style={{
                      left: `${50 + 40 * Math.cos(i * Math.PI / 4)}%`,
                      top: `${50 + 40 * Math.sin(i * Math.PI / 4)}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut"
                    }}
                  />
                ))}

                {/* Icon container */}
                <div className="flex justify-center items-center w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-yellow-100 shadow-inner hover:scale-105 transition-transform duration-300">
                  <card.icon className="w-16 h-16 text-pink-500 drop-shadow-md" />
                </div>
              </div>

              <div className="text-left px-2 pb-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">
                  {card.title}
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Added Image */}
        <div className="mt-16 flex justify-center">
          <motion.img
            src="/isThisU.png"
            alt="Is This You?"
            className="max-w-xs md:max-w-sm h-auto rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.5
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}
