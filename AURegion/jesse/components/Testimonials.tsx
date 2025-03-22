'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { start } from 'repl'

export default function Testimonials() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const testimonials = [
    {
      name: "Hoaithu Luu",
      role: "5-Year Loyal Client",
      image: "/rozy.jpeg", // Replace with actual image path
      quote: "I am happy when Jess did my eyelashes. They look natural and beautiful. I will recommend my friends to come to Jess. Thank you.",
      start: 5,
      profile: "/hoaithu.png",
      link: "https://maps.app.goo.gl/thWPdXegv4g5sPCY7"
    },
    {
      name: "Tinh Tran",
      role: "3-Year VIP Member",
      image: "/tinh.jpeg", // Replace with actual image path
      quote: "I got eyelash extensions done, was so perfect and Jess is really nice and professional. Would definitely recommend",
      start: 5,
      profile: "/tinhProfile.png",
      link: "https://maps.app.goo.gl/Lqdb8uM7SskULQLx5"
    },
    {
      name: "Michelle G",
      role: "4-Year Regular Client",
      image: "/michelleG.png", // Replace with actual image path
      quote: "Thank u so much! Lovely lashes and professional technique! Will come back!",
      start: 5,
      profile: "/michelle.jpg",
      link: "https://www.fresha.com/a/jess-beauty-studio-869-morley-12-marchant-way-yk7j7prt#modal-reviews"
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                if (testimonial.link) {
                  window.open(testimonial.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="w-full h-full bg-[#FF6B35] flex items-center justify-center text-white text-6xl font-bold">
                      ${testimonial.name.charAt(0)}
                    </div>`;
                  }}
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 px-3">
                <div className="bg-white rounded-t-3xl p-6 relative">
                  {/* Profile Image */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden relative">
                      <Image
                        src={testimonial.profile}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="w-full h-full bg-[#FF6B35] flex items-center justify-center text-white text-2xl font-bold">
                            ${testimonial.name.charAt(0)}
                          </div>`;
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-10"> {/* Add margin top to make space for profile image */}
                    <p className="text-md text-black/80 mb-6">
                      "{testimonial.quote}"
                    </p>

                    <div className="text-center">
                      <h4 className="text-xl font-bold text-black">{testimonial.name}</h4>
                      <p className="text-[#FF6B35] mb-2">{testimonial.role}</p>
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < testimonial.start
                              ? 'text-yellow-400'
                              : i === Math.floor(testimonial.start) && testimonial.start % 1 !== 0
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Review Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-16"
        >
          <a
            href="https://www.google.com/maps/place/Jess'+Beauty+Studio+869/@-31.9008491,115.9014628,17z/data=!4m17!1m8!3m7!1s0x2a32b1c8d178da49:0xfd0a3e6445537478!2sJess'+Beauty+Studio+869!8m2!3d-31.9007777!4d115.9012622!10e1!16s%2Fg%2F11w3s_k4gq!3m7!1s0x2a32b1c8d178da49:0xfd0a3e6445537478!8m2!3d-31.9007777!4d115.9012622!9m1!1b1!16s%2Fg%2F11w3s_k4gq?hl=en-AU&entry=ttu&g_ep=EgoyMDI1MDMxOS4xIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E85C2C] text-white font-medium rounded-full transition-colors flex items-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.97 13.01l-2.74-2.74a.996.996 0 0 1 0-1.41l.17-.17a.996.996 0 0 1 1.41 0l1.87 1.87 4.95-4.95a.996.996 0 0 1 1.41 0l.17.17c.39.39.39 1.02 0 1.41l-5.82 5.82a.996.996 0 0 1-1.41 0z" />
            </svg>
            Google Reviews
          </a>
          <a
            href="https://www.fresha.com/a/jess-beauty-studio-869-morley-12-marchant-way-yk7j7prt#modal-reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E85C2C] text-white font-medium rounded-full transition-colors flex items-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Fresha Reviews
          </a>
        </motion.div>
      </div>
    </section>
  )
}
