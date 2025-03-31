'use client'

import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import Testimonials from './components/Testimonials'
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
      name: "Jessie Nguyen",
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

      <section id="services" className="bg-gradient-to-r from-[#F8F4EA] to-[#F0EAD6] relative overflow-hidden min-h-screen py-10">

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
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-[#F8D7D2] rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#D1B882]/20 group"
                >
                  <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center scale-75 group-hover:scale-85 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D1B882] transition-colors">{member.name}</h3>
                  <p className="text-gray-700 mb-4 group-hover:text-gray-900 transition-colors">{member.role}</p>
                  <div className="flex items-center gap-3">
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D1B882] hover:text-[#e0cda2] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D1B882] hover:text-[#e0cda2] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D1B882] hover:text-[#e0cda2] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div> */}

            <div></div>

            <div className="flex flex-col md:flex-row-reverse gap-16 items-center my-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#D1B882]">
                  Meet the owner - Jessie
                </h2>
                <p className="text-gray-700">
                  "I’ve always loved beauty and dreamed of having my own studio one day—but I never expected it to happen this fast. In 2023, an unexpected opportunity led me into the beauty industry, and I took the leap to start my own business. It’s been an incredible journey of learning, growing, and perfecting my craft with every client I meet."
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
                  Jess Glow isn’t a big, busy salon—it’s your cozy, private retreat. Here, beauty is personal. Whether you’re getting lash extensions, brow shaping, or just taking a moment for yourself, we ensure every service is done with precision, patience, and genuine care.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative aspect-video">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Image
                      src="/room-2.jpg"
                      alt="Jess Glow"
                      fill
                      className="object-cover rounded-xl"
                    />
                    {/* <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 text-center text-sm text-white">
                      <p className="font-medium">Jess Glow</p>
                      <p className="text-gray-300">2025 all rights reserved</p>
                      <a
                        href="https://jessglow.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9945FF] hover:underline"
                      >
                        www.jessglow.com
                      </a>
                    </div> */}
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
                <div className="carousel carousel-center w-full h-full rounded-xl overflow-hidden" data-carousel-interval="3000">
                  <div id="slide1" className="carousel-item relative w-full aspect-[16/12]">
                    <div className="relative w-full h-full">
                      <Image
                        src="/customer.png"
                        alt="Our Salon"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href="#slide6" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❮</a>
                      <a href="#slide2" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❯</a>
                    </div>
                  </div>
                  <div id="slide2" className="carousel-item relative w-full aspect-[16/12]">
                    <div className="relative w-full h-full">
                      <Image
                        src="/example5.png"
                        alt="Our Salon"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href="#slide1" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❮</a>
                      <a href="#slide3" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❯</a>
                    </div>
                  </div>
                  <div id="slide3" className="carousel-item relative w-full aspect-[16/12]">
                    <div className="relative w-full h-full">
                      <Image
                        src="/example2.jpg"
                        alt="Our Designs"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href="#slide2" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❮</a>
                      <a href="#slide4" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❯</a>
                    </div>
                  </div>
                  <div id="slide4" className="carousel-item relative w-full aspect-[16/12]">
                    <div className="relative w-full h-full">
                      <Image
                        src="/example3.JPG"
                        alt="Our Expertise"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href="#slide3" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❮</a>
                      <a href="#slide5" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❯</a>
                    </div>
                  </div>
                  <div id="slide5" className="carousel-item relative w-full aspect-[16/12]">
                    <div className="relative w-full h-full">
                      <Image
                        src="/example4.png"
                        alt="Our Services"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href="#slide4" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❮</a>
                      <a href="#slide6" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❯</a>
                    </div>
                  </div>
                  <div id="slide6" className="carousel-item relative w-full aspect-[16/12]">
                    <div className="relative w-full h-full">
                      <Image
                        src="/example1.jpg"
                        alt="Our Services"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      <a href="#slide5" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❮</a>
                      <a href="#slide1" className="btn btn-circle bg-[#D1B882] border-none text-white hover:bg-[#e0cda2]">❯</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-48"></div>

            <Testimonials />

            {/* <div className="flex flex-col md:flex-row-reverse gap-16 items-center my-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#D1B882]">
                  Why Choose Us
                </h2>
                <p className="text-gray-700">
                  We pride ourselves on our attention to detail, creative designs, and commitment to client satisfaction. Our team stays up-to-date with the latest techniques and trends to provide you with exceptional service every time.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative aspect-[16/12]">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/aboutUs4.jpg"
                    alt="Our Designs"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div> */}
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}