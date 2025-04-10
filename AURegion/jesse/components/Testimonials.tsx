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
      image: "/rozy.jpeg", // Replace with actual image path
      quote: "I am happy when Jess did my eyelashes. They look natural and beautiful. I will recommend my friends to come to Jess. Thank you.",
      start: 5,
      profile: "/hoaithu.png",
      link: "https://maps.app.goo.gl/thWPdXegv4g5sPCY7"
    },
    {
      name: "Tinh Tran",
      image: "/tinh.jpeg", // Replace with actual image path
      quote: "I got eyelash extensions done, was so perfect and Jess is really nice and professional. Would definitely recommend",
      start: 5,
      profile: "/tinhProfile.png",
      link: "https://maps.app.goo.gl/Lqdb8uM7SskULQLx5"
    },
    {
      name: "Michelle G",
      image: "/michelleG.png", // Replace with actual image path
      quote: "Thank u so much! Lovely lashes and professional technique! Will come back!",
      start: 5,
      profile: "/michelle.jpg",
      link: "https://www.fresha.com/a/jess-beauty-studio-869-morley-12-marchant-way-yk7j7prt#modal-reviews"
    },
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Our Work Showcase
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See the stunning transformations and hear what our clients have to say about their experience
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center w-full my-6 mb-16"
        >
          <div className="h-0.5 w-24 bg-[#D1B882]"></div>
          <div className="mx-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#D1B882" />
            </svg>
          </div>
          <div className="h-0.5 w-24 bg-[#D1B882]"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => {
                if (testimonial.link) {
                  window.open(testimonial.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {/* Main Image */}
              <div className="aspect-[3/2] relative">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="w-full h-full bg-[#FF6B35] flex items-center justify-center text-white text-6xl font-bold">
                      ${testimonial.name.charAt(0)}
                    </div>`;
                  }}
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xl italic mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${i < testimonial.start ? 'text-yellow-400' : 'text-gray-300'}`}
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

              {/* Profile Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-[#D1B882] overflow-hidden relative">
                    <Image
                      src={testimonial.profile}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<div class="w-full h-full bg-[#FF6B35] flex items-center justify-center text-white text-sm font-bold">
                          ${testimonial.name.charAt(0)}
                        </div>`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-white/90 text-sm font-medium">{testimonial.name}</h4>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-16 md:mt-20">
          <div className="bg-white/90 px-4 py-3 rounded-xl shadow-md flex items-center gap-2 border border-[#D1B882]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="w-5 h-5" viewBox="0 0 24 24" fill="#2BB673">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            <span className="font-semibold">Verified Reviews</span>
          </div>
          <div className="bg-white/90 px-4 py-3 rounded-xl shadow-md flex items-center gap-2 border border-[#D1B882]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="w-5 h-5" viewBox="0 0 24 24" fill="#FF6B35">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="font-semibold">50+ Satisfied Clients</span>
          </div>
          <div className="bg-white/90 px-4 py-3 rounded-xl shadow-md flex items-center gap-2 border border-[#D1B882]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="w-5 h-5" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span className="font-semibold">Fast & Professional Service</span>
          </div>
        </div>

        {/* Review Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-16"
        >
          <a
            href="https://www.google.com/maps/place/Jess'+Beauty+Studio+869/@-31.9008491,115.9014628,17z/data=!4m17!1m8!3m7!1s0x2a32b1c8d178da49:0xfd0a3e6445537478!2sJess'+Beauty+Studio+869!8m2!3d-31.9007777!4d115.9012622!10e1!16s%2Fg%2F11w3s_k4gq!3m7!1s0x2a32b1c8d178da49:0xfd0a3e6445537478!8m2!3d-31.9007777!4d115.9012622!9m1!1b1!16s%2Fg%2F11w3s_k4gq?hl=en-AU&entry=ttu&g_ep=EgoyMDI1MDMxOS4xIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D1B882] text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#E2CA94] flex items-center gap-2"
          >
            <svg width="22" height="22" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="white"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
            Google Reviews
          </a>
          <a
            href="https://www.fresha.com/a/jess-beauty-studio-869-morley-12-marchant-way-yk7j7prt#modal-reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#D1B882] text-white px-8 py-4 rounded-full text-lg md:text-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-[#E2CA94] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" className="inline-block">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            Fresha Reviews
          </a>
        </motion.div>
      </div>
    </section>
  )
}
