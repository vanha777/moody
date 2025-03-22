'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Starters() {
  const [isMobile, setIsMobile] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

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

  const tutorials = [
    {
      title: "Social Media Strategy Masterclass",
      description: "Watch our free masterclass on building a powerful social media presence. Learn proven strategies for content planning, best posting times, and how to stand out in crowded feeds.",
      image: "/starter1.jpg"
    },
    {
      title: "Content Creation Secrets",
      description: "Discover professional tips for creating viral content. Our free video series covers everything from smartphone photography tricks to caption writing that drives engagement.",
      image: "/starter2.jpg"
    },
    {
      title: "Growth Hacking Workshop",
      description: "Join our free workshop to learn insider techniques for rapid follower growth. We share real case studies, engagement tactics, and proven methods to increase your reach organically.",
      image: "/starter3.jpg"
    }
  ];

  return (
    <section className="relative overflow-hidden flex items-center justify-center px-2 md:px-4 text-gray-800 py-24">
      <div className="absolute inset-0 bg-[#1a0b2e]">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7928CA] rounded-full filter blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF0080] rounded-full filter blur-[120px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0070F3] rounded-full filter blur-[150px] opacity-30" />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E1065]/90 via-[#4C1D95]/80 to-[#5B21B6]/70" />
      </div>

      <motion.div
        className="w-full relative z-10 px-4 md:px-8 lg:px-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-left my-32">
          <span className="bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">QUICK START</span>
          <br className="mb-12" />
          <span className="bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">GUIDES</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-black/20 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border border-white/10"
            >
              <div className="relative w-full aspect-video mb-4">
                <Image
                  src={tutorial.image}
                  alt={tutorial.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">
                  {tutorial.title}
                </h3>

                <p className="text-gray-200 mb-4">
                  {tutorial.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
