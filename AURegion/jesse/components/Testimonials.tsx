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
      name: "Sofia Nguyen",
      role: "5-Year Loyal Client",
      image: "/customer1.jpg", // Replace with actual image path
      quote: "I can't say enough good things about Glaze! The team is so friendly and welcoming. They really listen to what you want and make sure you leave happy. My nails have never looked this good!",
      start: 5,
      profile: "/customer1.jpg"
    },
    {
      name: "Fiano Pham",
      role: "3-Year VIP Member",
      image: "/customer2.jpg", // Replace with actual image path
      quote: "My nails usually chip within a few days, but after getting them done at Glaze, they've lasted over two weeks without any issues. I'm so impressed with the quality and attention to detail!",
      start: 5,
      profile: "/customer2.jpg"
    },
    {
      name: "Lisa Wong",
      role: "4-Year Regular Client",
      image: "/customer3.jpg", // Replace with actual image path
      quote: "I went to Glaze for the first time last week, and I'm already hooked! They took the time to understand exactly what I wanted, and the design turned out better than I could've imagined. Definitely coming back!",
      start: 4,
      profile: "/customer3.jpg"
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
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
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
      </div>
    </section>
  )
}
