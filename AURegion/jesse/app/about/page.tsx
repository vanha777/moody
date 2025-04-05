'use client'

import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import Testimonials from '@/components/Testimonials'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function About() {
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

  const teamMembers = [
    {
      name: "Jess Nguyen",
      role: "Jess Glow Founder",
      image: "/founder01.jpg",
      instagram: "https://instagram.com/glazenails",
      facebook: "https://facebook.com/glazenails",
      twitter: "https://twitter.com/glazenails"
    }
  ]

  return (
    <>
      <NavBar />

      <section id="services" className="bg-white relative overflow-hidden min-h-screen py-10">

        <motion.div
          className="container mx-auto relative z-10 px-4 md:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold my-32 mb-8">
              <span className="text-black">A Lil' Bit</span>{' '}
              <span className="text-[#D1B882]">
                About Us
              </span>
            </h1>

            <div className="flex items-center justify-center w-full my-6">
              <div className="h-0.5 w-24 bg-[#D1B882]"></div>
              <div className="mx-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#D1B882" />
                </svg>
              </div>
              <div className="h-0.5 w-24 bg-[#D1B882]"></div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="prose prose-lg max-w-none"
          >
            <div></div>

            <div className="flex flex-col md:flex-row-reverse gap-16 items-center my-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#D1B882]">
                  Meet the owner - Jess
                </h2>
                <p className="text-gray-700">
                  "I've always loved beauty and dreamed of having my own studio one day—but I never expected it to happen this fast. In 2023, an unexpected opportunity led me into the beauty industry, and I took the leap to start my own business. It's been an incredible journey of learning, growing, and perfecting my craft with every client I meet."
                </p>
              </div>
              <div className="w-full md:w-1/2 relative aspect-[16/12]">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/jess_1.png"
                    alt="Our Expertise"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="my-48"></div>

            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#D1B882]">
                  What you will find at Jess Glow
                </h2>
                <p className="text-gray-700">
                  Jess Glow isn't a big, busy salon—it's your cozy, private retreat. Here, beauty is personal. Whether you're getting lash extensions, brow shaping, or just taking a moment for yourself, we ensure every service is done with precision, patience, and genuine care.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative aspect-[16/12]">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Image
                      src="/studio.jpg"
                      alt="Jess Glow"
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="my-48"></div>

            <div className="flex flex-col md:flex-row gap-16 items-center my-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#D1B882]">
                  Why You'll Love It Here
                </h2>
                <p className="text-gray-700">
                  Your beauty experience should be more than just an appointment—it should be a moment to unwind, relax, and feel taken care of. At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued. From a welcoming space to personalized services, we're here to enhance your natural beauty while making self-care effortless and enjoyable.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="relative w-full aspect-[16/12] rounded-xl overflow-hidden">
                  <Image
                    src="/customer.png"
                    alt="Our Salon"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="my-48"></div>
            <Testimonials />
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}