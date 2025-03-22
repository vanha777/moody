'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

export default function PricingHero() {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)

  const services = [
    {
      title: "Lashes",
      description: "Whether you prefer classic lashes for timeless elegance or hybrid lashes for a fuller, voluminous look, we've got you covered to enhance your natural beauty.",
      image: "/manicure.jpg",
      subServices: [
        {
          name: "Classic Lashes",
          description: "Classic lashes involve applying a single lash extension to each natural lash. This technique enhances length and can create a more subtle, natural look.",
          price: 90.25,
          duration: "95 min",
          image: "/3.png"
        },
        {
          name: "Hybrid Lashes",
          description: "Hybrid lashes combine both classic and volume lash techniques. They typically feature a mix of individual lash extensions (classic) and fans of multiple lashes (volume), resulting in a fuller, textured look while still maintaining some natural appearance.",
          price: 113.05,
          duration: "95 min",
          image: "/3.png"
        },
        {
          name: "Natural Volume Lashes 3D-5D",
          description: "Volume 3D-5D. Natural volume lashes use a technique that applies multiple lightweight lash extensions to each natural lash, creating a fuller look without being overly dramatic. ",
          price: 132.05,
          duration: "105 min",
          image: "/3.png"
        },
        {
          name: "Glam Volume Lashes 10D-14D",
          description: "Mega volume lashes take the volume lash technique to the next level by using a larger number of ultra-lightweight extensions per natural lash—typically ranging from 6D to 15D or even more.",
          price: 152,
          duration: "105 min",
          image: "/3.png"
        },
        {
          name: "Gel Polish",
          description: "Long-lasting, chip-free polish that stays perfect for weeks",
          price: 40,
          duration: "45 min",
          image: "/3.png"
        },
        {
          name: "Removal",
          description: "Lash removal refers to the process of safely removing eyelash extensions, whether they are classic, volume, or mega volume.",
          price: 19,
          duration: "10 min",
          image: "/3.png"
        },
        {
          name: "Add-Ons Color Lash Extension",
          description: "These are eyelash extensions that come in a variety of colors, allowing you to enhance your natural lashes or create dramatic effects. They can be used individually or mixed with classic black extensions for added dimension.",
          price: 14.25,
          duration: "15 min",
          image: "/3.png"
        },
        {
          name: "Under Lash Extension",
          description: "These are individual lash extensions applied to the lower lashes to create a fuller and more dramatic look. They can help balance out the overall appearance of your eyes, especially if you have heavy upper lash extensions.",
          price: 9.50,
          duration: "15 min",
          image: "/3.png"
        },
        {
          name: "Lash Lift",
          description: "A lash lift is a perming treatment that curls and lifts your natural lashes from the root, giving them a more defined and elongated appearance.",
          price: 76,
          duration: "45 min",
          image: "/3.png"
        },
        {
          name: "Lash Tint",
          description: "Lash tinting involves applying a semi-permanent dye to your lashes to darken them, enhancing their visibility and creating a more defined look.",
          price: 23.75,
          duration: "15 min",
          image: "/3.png"
        },
        {
          name: "Lash Lift and Tint",
          description: "A lash lift and tint is a beauty treatment designed to enhance your natural lashes without the use of extensions.",
          price: 88,
          duration: "60 min",
          image: "/3.png"
        }
      ]
    },
    {
      title: "Brow Shaping & Tinting",
      description: "Get perfectly shaped and tinted brows that beautifully frame your face.",
      image: "/extension.jpg",
      subServices: [
        {
          name: "Brow Lamination",
          description: "Brow lamination is a cosmetic treatment that helps to create fuller, mor defined brows by restructuring the hair for a polished look. It gives your brows a groomed and voluminous look.",
          price: 71.25,
          duration: "45 min",
          image: "/3.png"
        },
        {
          name: "Brow Tint",
          description: "A semi-permanent dye is applied to the brow hairs to enhance their color. The tint is usually left on for a few minutes, depending on the desired depth of color, and then it's removed.",
          price: 19,
          duration: "15 min",
          image: "/3.png"
        },
        {
          name: "Brow Wax",
          description: "Warm wax is applied to the areas around the eyebrows where unwanted hair exists. A cloth or paper strip is then placed over the wax and quickly pulled away, removing the hair from the root.",
          price: 19,
          duration: "15 min",
          image: "/3.png"
        },
        {
          name: "Brow Lamination + Tint",
          description: "When done together, brow lamination and tinting can create a polished, defined look that enhances your natural brow shape and color. Many people love this combo for a low-maintenance yet striking brow appearance.",
          price: 80,
          duration: "60 min",
          image: "/3.png"
        },
        {
          name: "Brow Lamination + Wax + Tint",
          description: "Fuller Appearance: Lamination and tinting together create the illusion of thicker brows.Defined Shape: Waxing shapes the brows while lamination keeps them in place. Low Maintenance: The combined effects reduce the need for daily brow makeup.",
          price: 85,
          duration: "75 min",
          image: "/3.png"
        }
      ]
    },
    {
      title: "Facials",
      description: "Refresh and hydrate your skin with rejuvenating facials, leaving you with a glowing, radiant look.",
      image: "/design.jpg",
      subServices: [
        {
          name: "Acne Treatments",
          description: "Skin Examination- Deep Cleanse the Skin - Remove Acne with Specialized Instruments- Apply Mask and Biolight- Apply Serum and Cream.",
          price: 79,
          duration: "40 min",
          image: "/3.png"
        },
        {
          name: "Deluxe Deep Facial Massage 60 mins",
          description: "Skin Examination - Deep Cleansing - Relaxing Face Lifting by HOT massage-  Acne removal ( option) - COLD Massage to Firm the Skin and Shrink Pores- Relax with Mask and omega light, - Apply Serum and Cream.",
          price: 89,
          duration: "60 min",
          image: "/3.png"
        },
        {
          name: "Pro-lifted Facial Massage 45-mins",
          description: "Skin Examination- Deep Cleansing - Relaxing Face Lift Massage with Massage Cream Suitable for Each Skin Type- Relax with Mask- Apply Serum and Cream.",
          price: 79,
          duration: "45 min",
          image: "/3.png"
        }
      ]
    },
    {
      title: "Refill",
      description: "Revive your lashes with a quick, expert touch-up, restoring fullness and flair in no time!",
      image: "/design.jpg",
      subServices: [
        {
          name: "Refill Angle Wings Lashes",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 105,
          duration: "80 min",
          image: "/3.png"
        },
        {
          name: "Refill Baby Lashes",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 105,
          duration: "80 min",
          image: "/3.png"
        },
        {
          name: "Refill Multi Level Lashes",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 120,
          duration: "90 min",
          image: "/3.png"
        },
        {
          name: "Refill Wet Look",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 115,
          duration: "90 min",
          image: "/3.png"
        },
        {
          name: "Refill Eyeliner Lashes",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 40-50% of lashes remaining to book this service and must be booked within 16-21 days from your last service. After 21 days a new set will be required or if you have lost more than 70% in this time.",
          price: 125,
          duration: "70 min",
          image: "/3.png"
        },
        {
          name: "Refill Katun Lashes",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 40-50% of lashes remaining to book this service and must be booked within 16-21 days from your last service. After 21 days a new set will be required or if you have lost more than 70% in this time.",
          price: 110,
          duration: "60 min",
          image: "/3.png"
        },
        {
          name: "Refill Natural Volume",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 84.55,
          image: "/3.png"
        },
        {
          name: "Refill Mega",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 103.55,
          duration: "75 min",
          image: "/3.png"
        },
        {
          name: "Refill Hybrid",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 89,
          duration: "70 min",
          image: "/3.png"
        },
        {
          name: "Refill Classic",
          description: "A healthcheck appointment, remove any extensions growing out and infill with new lash extensions where required. You must have at least 50-60% of lashes remaining to book this service and must be booked with in 7-15 days from your last service.",
          price: 65,
          duration: "60 min",
          image: "/3.png"
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
      <section id="services" className="bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB] relative overflow-hidden min-h-screen py-10">
        <div className="container mx-auto relative z-10 px-4 md:px-8">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold  my-32 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-black">Our</span>{' '}
            <span className="text-[#FF6B35]">Premium Services</span>
          </motion.h1>
          
          <motion.div 
            className="flex items-center justify-center w-full my-6 mb-16"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="h-0.5 w-24 bg-[#FF6B35]"></div>
            <div className="mx-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FF6B35" />
              </svg>
            </div>
            <div className="h-0.5 w-24 bg-[#FF6B35]"></div>
          </motion.div>

          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between gap-8 mb-20`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
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
                      className="backdrop-blur-sm rounded-lg p-5 hover:bg-white/70 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] border-b border-[#FF6B35]/10"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#FF6B35] mb-1">
                            {subService.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">
                            <span className="font-medium">Estimate:</span> {subService.duration}
                          </span>
                          <div className="h-[1px] w-12 bg-[#FF6B35]/30 hidden sm:block" />
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
                  href="https://colaunch-it.vercel.app/booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#FF6B35] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-semibold"
                >
                  Book Now
                </a>
              </div>

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
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}