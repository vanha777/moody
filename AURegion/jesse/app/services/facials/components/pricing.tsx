'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function PricingHero() {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const services = [
    {
      title: "Facials",
      description: "Give your skin a little extra love with our no-fuss facials—perfect for a quick refresh, deep cleanse, or a moment of relaxation. Whether you're tackling breakouts, soothing your skin, or just want a healthy glow, we've got a simple, effective treatment for you.",
      image: "/facial_home.png",
      subServices: [
        {
          name: "Clear Glow - Acne Treatment",
          description: "A deep cleanse with gentle extractions to clear breakouts, followed by a soothing mask and biolight to calm and heal your skin.",
          price: "60-150",
          duration: "30 min",
          // image: "/3.png"
        },
        {
          name: "Serenity touch- relaxation facial massage",
          description: "Melt away stress with a warm lifting massage, optional extractions, and a cooling mask to refresh and firm your skin.",
          price: "69",
          duration: "30 min",
          // image: "/3.png"
        },
        {
          name: "Deep Rejuvanate- Duluxe Tissue facial Massage",
          description: "A revitalizing massage to boost circulation, relieve tension, and leave your skin feeling soft, smooth, and refreshed.",
          price: "89",
          duration: "60 min",
          image: ""
        }
      ]
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

  return (
    <>
      <section id="services" className="bg-white relative overflow-hidden min-h-screen py-10">
        <div className="container mx-auto relative z-10 px-4 md:px-8">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold  my-32 mb-8 pb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-black">Our</span>{' '}
            <span className="text-[#D1B882]">Premium Services</span>
          </motion.h1>

          <motion.div
            className="flex items-center justify-center w-full my-6 mb-16 pb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="h-0.5 w-24 bg-[#D1B882]"></div>
            <div className="mx-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#D1B882" />
              </svg>
            </div>
            <div className="h-0.5 w-24 bg-[#D1B882]"></div>
          </motion.div>


          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-8 mb-20`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="rounded-[30px] overflow-hidden shadow-lg aspect-square">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-black whitespace-pre-line">
                    {service.title}
                  </span>
                </h2>
                <p className="text-black text-lg mb-8">
                  {service.description}
                </p>

                {/* Sub-services */}
                <div className="grid grid-cols-1 gap-3 mb-8">
                  {service.subServices?.map((subService, idx) => (
                    <motion.div
                      key={subService.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      onClick={() => setExpandedService(expandedService === subService.name ? null : subService.name)}
                      className="backdrop-blur-sm rounded-lg p-5 hover:bg-white/70 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border-b border-[#D1B882]/10"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#D1B882] mb-1">
                            {subService.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            <span className="font-medium">Estimate:</span> {subService.duration}
                          </span>
                          <div className="h-[1px] w-12 bg-[#D1B882]/30 hidden sm:block" />
                          <span className="text-xl font-semibold text-gray-900">
                            <span className="text-sm font-normal text-gray-600 mr-1">From:</span>${subService.price}
                          </span>
                        </div>
                      </div>
                      {/* Description dropdown */}
                      {expandedService === subService.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 text-gray-600"
                        >
                          <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className={`${subService.image ? 'md:w-3/4' : 'w-full'}`}>
                              {subService.description}
                            </div>
                            {subService.image && (
                              <div className="w-full md:w-1/4 mb-3 md:mb-0">
                                <div className="rounded-lg overflow-hidden aspect-square shadow-sm">
                                  <img
                                    src={subService.image}
                                    alt={subService.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <a
                  href="https://moosy.vercel.app/booking/jess-glow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#D1B882] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-semibold"
                >
                  Book Now
                </a>
              </div>


            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-black">Frequently Asked</span>{' '}
            <span className="text-[#D1B882]">Questions</span>
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            {[
              {
                question: "How often should I get a facial?",
                answer: "For optimal skin health, we recommend getting a facial every 4-6 weeks. This timing aligns with your skin's natural renewal cycle and helps maintain consistent results. However, the frequency can be adjusted based on your specific skin concerns and goals."
              },
              {
                question: "Are facials suitable for all skin types?",
                answer: "Yes, our facials are customized to suit all skin types. Whether you have dry, oily, combination, or sensitive skin, we'll tailor the treatment to address your specific needs and concerns."
              },
              {
                question: "How should I prepare for my facial appointment?",
                answer: "Please arrive with clean skin, free of makeup. Avoid using any harsh skincare products 24 hours before your appointment. If you have any skin conditions or allergies, please inform us beforehand."
              },
              {
                question: "What should I expect after a facial?",
                answer: "Your skin may appear slightly red immediately after the treatment, but this typically subsides within a few hours. You'll notice improved hydration and a healthy glow. We'll provide you with specific aftercare instructions to maintain your results."
              },
              {
                question: "Can I wear makeup after a facial?",
                answer: "We recommend waiting at least 6 hours before applying makeup after a facial to allow your skin to fully absorb the benefits of the treatment. When you do apply makeup, use clean brushes and gentle products."
              },
              {
                question: "What's the difference between the different facial treatments?",
                answer: "Our Clear Glow treatment focuses on acne and breakouts, Serenity Touch provides relaxation and stress relief, while Deep Rejuvenate offers a more intensive massage and rejuvenation experience. Each treatment is designed to address specific skin concerns and goals."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-6"
              >
                <div
                  className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300 border-2 border-[#D1B882]/30 hover:border-[#D1B882]/50 bg-gradient-to-r from-white to-[#D1B882]/5"
                  onClick={() => setExpandedService(expandedService === `faq-${index}` ? null : `faq-${index}`)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-[#D1B882] mr-3"></span>
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-6 h-6 text-[#D1B882] transform transition-transform duration-300 ${expandedService === `faq-${index}` ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {expandedService === `faq-${index}` && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-gray-600 border-t border-[#D1B882]/20 pt-4 pl-5"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}