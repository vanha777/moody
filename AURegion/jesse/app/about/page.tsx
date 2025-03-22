'use client'

import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
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
      name: "Sarah Johnson",
      role: "Senior Nail Artist",
      image: "/founder01.jpg",
      instagram: "https://instagram.com/glazenails",
      facebook: "https://facebook.com/glazenails",
      twitter: "https://twitter.com/glazenails"
    },
    {
      name: "Michelle Lee",
      role: "Creative Director",
      image: "/founder02.jpg",
      instagram: "https://instagram.com/glazenails",
      facebook: "https://facebook.com/glazenails",
      twitter: "https://twitter.com/glazenails"
    }
  ]

  return (
    <>
      <NavBar />

      <section className="relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB]">
        </div>

        <motion.div
          className="relative z-10 px-6 py-24 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold my-32 mb-8">
              <span className="text-black">Welcome to</span>{' '}
              <span className="text-[#FF6B35]">
                Glaze Nails
              </span>
            </h1>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="prose prose-lg max-w-none"
          >
            <div className="flex flex-col md:flex-row gap-16 items-center my-48">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#FF6B35]">
                  Who We Are
                </h2>
                <p className="text-gray-700">
                  At Glaze Nails, we're more than just a nail salon - we're artists who transform your nails into stunning works of art. Using cutting-edge techniques and premium products, we create designs that make you feel confident and beautiful.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative aspect-video">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <div className="flex flex-col items-center justify-center h-full">
                    <Image
                      src="/aboutUs1.png"
                      alt="Glaze Nails"
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 text-center text-sm text-white">
                      <p className="font-medium">Glaze Nails</p>
                      <p className="text-gray-300">2025 all rights reserved</p>
                      <a
                        href="https://glaze-nails.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9945FF] hover:underline"
                      >
                        www.glazenails.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/50 rounded-xl p-6 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#FF6B35]/20 group"
                >
                  <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center scale-75 group-hover:scale-85 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF6B35] transition-colors">{member.name}</h3>
                  <p className="text-gray-700 mb-4 group-hover:text-gray-900 transition-colors">{member.role}</p>
                  <div className="flex items-center gap-3">
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6B35] hover:text-[#ff8255] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6B35] hover:text-[#ff8255] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF6B35] hover:text-[#ff8255] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="my-48"></div>

            <div className="flex flex-col md:flex-row-reverse gap-16 items-center my-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#FF6B35]">
                  Our Expertise
                </h2>
                <p className="text-gray-700">
                  From classic manicures to intricate nail art, our skilled technicians bring years of experience and creativity to every service. We stay ahead of the latest trends while maintaining the highest standards of hygiene and professionalism.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative aspect-[16/12]">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/aboutUs2.jpeg"
                    alt="Our Expertise"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="my-48"></div>

            <div className="flex flex-col md:flex-row gap-16 items-center my-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#FF6B35]">
                  Premium Experience
                </h2>
                <p className="text-gray-700">
                  Every visit to Glaze Nails is an opportunity to experience luxury nail care. Our modern salon features state-of-the-art equipment and premium products, ensuring your comfort and satisfaction.
                </p>
              </div>
              <div className="w-full md:w-1/2 relative aspect-[16/12]">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="/aboutUs3.png"
                    alt="Our Salon"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="my-48"></div>

            <div className="flex flex-col md:flex-row-reverse gap-16 items-center my-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#FF6B35]">
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
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  )
}