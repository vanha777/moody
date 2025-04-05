'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function PricingHero() {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const services = [
    {
      title: "Lash extensions",
      description: "Eyelash extensions are semi-permanent fibers individually attached to your natural lashes using a safe, professional-grade adhesive. This technique enhances length, fullness, and curl, giving you a custom look—whether soft and natural or bold and voluminous",
      image: "/extension.png",
      subServices: [
        {
          name: "Baby Doll",
          description: "Soft, fluttery, and ultra-light! Perfect for a delicate, doe-eyed look that keeps it sweet and natural.",
          price: 140,
          duration: "1h30",
          image: "/baby_doll.png"
        },
        {
          name: "Angle wings",
          description: "Lifted, elongated, and a little dramatic! This winged lash style enhances your eye shape for a flirty, cat-eye effect.",
          price: "140",
          duration: "1h30",
          image: "/fairy_wings.png"
        },
        {
          name: "Wet Look",
          description: "Bold, glossy, and full of drama! This lash style gives that freshly-coated mascara effect—perfect for a sultry, high-impact look.",
          price: 140,
          duration: "1h30",
          image: "/wet_look.png"
        },
        {
          name: "Anime",
          description: "Big, bright, and doll-like! Inspired by anime characters, these lashes open up your eyes for a wide-eyed, playful effect.",
          price: 140,
          duration: "1h30",
          image: "/animate.png"

        },
        {
          name: "Sunflower",
          description: "A unique spiky lash style that combines narrow, well-defined fans with longer spikes for a bold, textured look.",
          price: 150,
          duration: "1h30",
          image: "/sun_flower.png"
        },
        {
          name: "Multi layer",
          description: "Full, fluffy, and dimensional! This style uses different lengths and layers to create texture and depth for a voluminous but airy look.",
          price: 155,
          duration: "1h30",
          image: "/multi_layer.png"
        },
        {
          name: "Wispy Katun Thai",
          description: "Light, soft, and feathery with a touch of luxury—perfect for a natural yet elevated look.",
          price: 165,
          duration: "1h30",
          image: "/wispy_katun_thai.png"
        },
        {
          name: "Glow foxy eyes (Signature)",
          description: "Bold and lifted! These lashes create a foxy, winged effect that elongates and defines your eyes for a sultry, cat-eye look.",
          price: 175,
          duration: "1h30",
          image: "/glow_fox_eye_(Signature).png"
        },
        {
          name: "Individual (classic)",
          description: "Simple, timeless, and naturally beautiful. A single extension is applied to each lash for a soft, effortless enhancement.",
          price: 109,
          duration: "1h15",
          image: "/individual.png"
        },
        {
          name: "Hybrid",
          description: " A little classic, a little volume! Hybrid lashes mix single extensions and volume fans for a wispy, fuller-but-still-natural look.",
          price: 129,
          duration: "1h15",
          image: "/hybrid_lash.png"
        },
        {
          name: "Natural volume 3D-5D",
          description: "Soft and fluttery! Multiple lightweight extensions create a fuller look, without being too dramatic.",
          price: 139,
          duration: "1h15",
          image: "/nature_volume_3D-5D.png"
        },
        {
          name: "Glow mega volume 10D-14D",
          description: "Bold and intense! You'll love the ultimate in volume lashes, using ultra-light extensions to create a full, dramatic effect.",
          price: 165,
          duration: "1h30",
          image: "/glow_mega_volume_10D-14D.png"
        }
      ]
    },
    {
      title: "Lash Lift",
      description: "Lash Lift is a semi-permanent treatment that enhances your natural curl, giving your lashes a lifted, voluminous look without extensions.",
      image: "/lift.png",
      subServices: [
        {
          name: "Korean Lash Lift + Collagen",
          // description: "Soft, fluttery, and ultra-light! Perfect for a delicate, doe-eyed look that keeps it sweet and natural.",
          price: "85",
          duration: "45 min",
          // image: "/3.png"
        },
        {
          name: "Lash Tint & Lift ",
          description: "",
          price: "95",
          duration: "25 min",
          image: ""
        }
      ]
    },
    {
      title: "Lash Refill",
      description: `
      Refill from 2-4  weeks : $70-$120 (varies by design) . 
Refill after 4+ weeks : A new full set will be required 

💡 Refill Rule: If you have less than 40% of your extensions left at your appointment, a full set will be needed to maintain a full, even look.  Not sure? Send us a photo  in the chat box section before booking! `,
      image: "/refill.png",
      subServices: [
        {
          name: "Baby Doll",
          // description: "Soft, fluttery, and ultra-light! Perfect for a delicate, doe-eyed look that keeps it sweet and natural.",
          price: "70 - 100",
          duration: "1h",
          // image: "/baby_doll.png"
        },
        {
          name: "Angle wings",
          // description: "Lifted, elongated, and a little dramatic! This winged lash style enhances your eye shape for a flirty, cat-eye effect.",
          price: "70 - 100",
          duration: "1h",
          // image: "/fairy_wings.png"
        },
        {
          name: "Wet Look",
          // description: "Bold, glossy, and full of drama! This lash style gives that freshly-coated mascara effect—perfect for a sultry, high-impact look.",
          price: "70 - 100",
          duration: "1h",
          // image: "/wet_look.png"
        },
        {
          name: "Anime",
          // description: "Big, bright, and doll-like! Inspired by anime characters, these lashes open up your eyes for a wide-eyed, playful effect.",
          price: "70 - 100",
          duration: "1h",
          // image: "/animate.png"
        },
        {
          name: "Sunflower",
          // description: "A unique spiky lash style that combines narrow, well-defined fans with longer spikes for a bold, textured look.",
          price: "80 - 110",
          duration: "1h",
          // image: "/sun_flower.png"
        },
        {
          name: "Multi layer",
          // description: "Full, fluffy, and dimensional! This style uses different lengths and layers to create texture and depth for a voluminous but airy look.",
          price: "85 - 110",
          duration: "1h",
          // image: "/multi_layer.png"
        },
        {
          name: "Wispy Katun Thai",
          // description: "Light, soft, and feathery with a touch of luxury—perfect for a natural yet elevated look.",
          price: "90 - 120",
          duration: "1h",
          // image: "/wispy_katun_thai.png"
        },
        {
          name: "Glow foxy eyes (Signature)",
          // description: "Bold and lifted! These lashes create a foxy, winged effect that elongates and defines your eyes for a sultry, cat-eye look.",
          price: "95 - 125",
          duration: "1h",
          // image: "/glow_fox_eye_(Signature).png"
        },
        {
          name: "Individual (classic)",
          // description: "Simple, timeless, and naturally beautiful. A single extension is applied to each lash for a soft, effortless enhancement.",
          price: "65 - 95",
          duration: "1h",
          // image: "/individual.png"
        },
        {
          name: "Hybrid",
          // description: " A little classic, a little volume! Hybrid lashes mix single extensions and volume fans for a wispy, fuller-but-still-natural look.",
          price: "70 - 100",
          duration: "1h",
          // image: "/hybrid_lash.png"
        },
        {
          name: "Natural volume 3D-5D",
          // description: "Soft and fluttery! Multiple lightweight extensions create a fuller look, without being too dramatic.",
          price: "80 - 110",
          duration: "1h",
          // image: "/nature_volume_3D-5D.png"
        },
        {
          name: "Glow mega volume 10D-14D",
          description: "",
          price: "90 - 120",
          duration: "1h",
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
      <section id="services" className="bg-gradient-to-r from-[#F8F4EA] to-[#F0EAD6] relative overflow-hidden min-h-screen py-10">
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
                  href="https://colaunch-it.vercel.app/booking/jess-glow"
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
      <section className="bg-gradient-to-r from-[#F8F4EA] to-[#F0EAD6] py-20">
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
                question: "How long do eyelash extensions last?",
                answer: "Eyelash extensions typically last between 2-4 weeks, depending on your natural lash growth cycle and how well you care for them. Regular refills every 2-3 weeks are recommended to maintain a full look."
              },
              {
                question: "Are eyelash extensions safe?",
                answer: "Yes, when applied by a trained professional using high-quality products, eyelash extensions are completely safe. We use medical-grade adhesives and follow strict hygiene protocols to ensure your safety and comfort."
              },
              {
                question: "How should I prepare for my appointment?",
                answer: "Please arrive with clean, makeup-free eyes. Avoid using oil-based products around your eyes before your appointment. If you wear contact lenses, you may want to remove them before the service."
              },
              {
                question: "Can I wear makeup with eyelash extensions?",
                answer: "Yes, but you should avoid oil-based makeup products and waterproof mascara. We recommend using water-based makeup and gentle makeup removers. Never use an eyelash curler on your extensions."
              },
              {
                question: "What's the difference between classic and volume lashes?",
                answer: "Classic lashes involve attaching one extension to one natural lash, creating a natural look. Volume lashes use multiple lightweight extensions per natural lash, creating a fuller, more dramatic effect."
              },
              {
                question: "How do I care for my eyelash extensions?",
                answer: "Avoid getting your lashes wet for the first 24 hours after application. Clean them daily with a lash-safe cleanser, avoid rubbing your eyes, and brush them gently with a clean spoolie brush."
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
                  className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => setExpandedService(expandedService === `faq-${index}` ? null : `faq-${index}`)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
                    <svg
                      className={`w-6 h-6 text-[#D1B882] transform transition-transform duration-300 ${
                        expandedService === `faq-${index}` ? 'rotate-180' : ''
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
                      className="mt-4 text-gray-600"
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