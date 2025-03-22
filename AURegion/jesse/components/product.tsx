'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Product {
  id: number
  name: string
  description: string
  price: string
  image: string
}

export default function Product() {
  const [isMobile, setIsMobile] = useState(false)

  const products: Product[] = [
    {
      id: 1,
      name: "ageLOC Boost® System",
      description: "Activating Serum to bring out your skin's brilliant best, leaving it visibly brighter, plumper, and bouncier, illuminating your complexion with a youthful radiance and even tone.",
      price: "$439.00",
      image: "/1.png"
    },
    {
      id: 2,
      name: "ageLOC® Galvanic Spa® System",
      description: "MEET AGELOC® GALVANIC SPA® ageLOC® Galvanic Spa® is our most powerful, comprehensive at-home beauty device, designed to help deliver charged treatment products that visibly improve skin.",
      price: "$576.00",
      image: "/4.png"
    },
    {
      id: 3,
      name: "Enhancer Skin Conditioning Gel",
      description: "Enhance your skin care routine. With conditioning and soothing ingredients like aloe vera, panthenol, and NaPCA, Enhancer soothes the skin and prevents moisture loss.",
      price: "$29.00",
      image: "/2.png"
    },
    {
      id: 4,
      name: "ageLOC® Tru Face® Essence Ultra",
      description: "Say hello to firmer, younger-looking skin with ageLOC Tru Face Essence Ultra—an anti-ageing face serum that delivers visibly lifted, contoured, and defined skin.",
      price: "$255.00",
      image: "/3.png"
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section id="products" className="bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-left md:text-right mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Products
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
              variants={itemVariants}
            >
              <div className="h-74 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/hero.jpg"
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[#FF6B35] font-bold text-xl">{product.price}</span>
                  <div className="bg-[#FF6B35] text-white px-4 py-2 rounded-full text-sm font-medium">
                    Learn More
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
