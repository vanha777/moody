'use client';

import { motion } from 'framer-motion';
import { FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';

const OpeningHours = () => {
  // Get current day (0 = Sunday, 1 = Monday, etc.)
  const currentDay = new Date().getDay();

  const businessHours = [
    { day: 'Sunday', hours: '10:00 AM - 6:00 PM', isOpen: true },
    { day: 'Monday', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Thursday', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Friday', hours: '9:00 AM - 7:00 PM', isOpen: true },
    { day: 'Saturday', hours: '9:00 AM - 6:00 PM', isOpen: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="location" className="relative overflow-hidden py-24 bg-gradient-to-r from-[#FFF5E6] to-[#FFF0DB]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left Side - Visit Us */}
          <motion.div
            className="md:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-24">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
                Visit Us Today! ✨
              </h2>
              <p className="text-lg text-black/70 mb-6">
                Experience luxury nail care in a welcoming atmosphere. We're conveniently located in the heart of Hawthorn.
              </p>
              <motion.a
                href="https://colaunch-it.vercel.app/booking"
                className="inline-flex items-center space-x-2 bg-[#FF6B35] text-white px-6 py-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiCalendar className="h-5 w-5" />
                <span>Book Appointment</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Side - Map and Hours */}
          <motion.div
            className="md:w-2/3 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Location Card with larger map */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-[#FF6B35] p-4 rounded-full text-white shadow-lg">
                  <FiMapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black">Our Location</h3>
                  <p className="text-black/70">Hawthorn, Australia, VIC, 3123</p>
                </div>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6302.033129864525!2d145.04203508648268!3d-37.83649806305071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad64220d47b0977%3A0x9fe9ba993bd739c9!2s458%20Tooronga%20Rd%2C%20Hawthorn%20East%20VIC%203123!5e0!3m2!1sen!2sau!4v1742278281900!5m2!1sen!2sau" width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"></iframe>
                {/* <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6302.033129864525!2d145.04203508648268!3d-37.83649806305071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad64220d47b0977%3A0x9fe9ba993bd739c9!2s458%20Tooronga%20Rd%2C%20Hawthorn%20East%20VIC%203123!5e0!3m2!1sen!2sau!4v1742278281900!5m2!1sen!2sau"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe> */}
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-[#FF6B35] p-4 rounded-full text-white shadow-lg">
                  <FiClock className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-black">Opening Hours</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {businessHours.map((schedule, index) => (
                  <motion.div
                    key={schedule.day}
                    variants={itemVariants}
                    className={`flex justify-between items-center p-3 rounded-lg ${currentDay === index ? 'bg-[#FF6B35]/10 shadow-sm' : ''
                      }`}
                  >
                    <span className={`font-medium ${currentDay === index ? 'text-[#FF6B35]' : 'text-black'}`}>
                      {schedule.day}
                    </span>
                    <span className="text-black/70">{schedule.hours}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OpeningHours;