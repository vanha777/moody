'use client'

import { motion } from 'framer-motion'
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

  return (
    <section className="bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] relative overflow-hidden flex items-center justify-center py-24">
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
        className="w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-8">
          <span className="text-black relative">
            WHY CHOOSE US?
            <motion.div
              className="absolute left-1/2 -bottom-4 h-0.5 w-24 bg-[#FF6B35] rounded-full -translate-x-1/2"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 96, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </span>
        </h1>

        {/* Added description text */}
        <motion.p
          className="text-center max-w-3xl mx-auto text-lg md:text-xl text-gray-700 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          With a 90% customer retention rate, our clients love us because we take pride in our work. We proudly use 100% premium, non-toxic products for long-lasting beauty. Because you deserve the best!
        </motion.p>

        {/* Updated CTA Button with new color */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="/about"
            className="bg-[#FF6B35] text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#ff8255]"
          >
            Our Story
          </a>
        </motion.div>

        {/* Images section with two equal subsections */}
        <div className="flex justify-center items-stretch flex-col md:flex-row">
          {/* Left subsection */}
          <div className="flex-1 flex items-center justify-center">
            <motion.img
              src="/statement1.jpg"
              alt="Is This You?"
              className="w-80 h-80 md:w-[700px] md:h-[700px] rounded-full object-cover shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.5
              }}
            />
          </div>

          {/* Right subsection */}
          <div className="flex-1 flex items-center justify-center">
            <motion.img
              src="/statement2.jpg"
              alt="Another perspective"
              className="w-48 md:w-72 h-auto rounded-[90px]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                height: isMobile ? "400px" : "700px",
                objectFit: "cover",
                transform: "rotate(-15deg)",
                transformOrigin: "center"
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: 1,
                x: 0,
                rotate: 15
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.7
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
