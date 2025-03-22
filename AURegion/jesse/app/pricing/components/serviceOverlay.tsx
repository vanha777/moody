'use client'

import { motion } from 'framer-motion'
import { FaClock } from 'react-icons/fa'

interface ServiceOverlayProps {
  service: {
    mainService: string
    name: string
    description: string
    price: number
    duration: string
  }
  onClose: () => void
}

export default function ServiceOverlay({ service, onClose }: ServiceOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[#FF6B35] text-sm font-semibold mb-2">
              {service.mainService}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {service.name}
            </h2>
            <div className="flex items-center gap-6">
              <span className="text-2xl font-bold text-[#FF6B35]">
                ${service.price}
              </span>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="w-4 h-4" />
                <span>{service.duration}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="prose max-w-none">
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 text-lg">
              {service.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="https://calendly.com/sofiang2407/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-block bg-[#FF6B35] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 text-lg font-semibold text-center"
            >
              Book This Service
            </a>
            <p className="text-gray-500 text-sm">
              Duration: {service.duration}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
