'use client';

import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram, FiFacebook } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import { useState, useRef, useEffect } from 'react';
import processCommand from '@/app/ultilities/mod';

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const socialLinks = [
    // {
    //   icon: <FiX className="h-5 w-5" />,
    //   name: 'Twitter',
    //   url: 'https://x.com/patricksaturnor'
    // },
    {
      icon: <FiInstagram className="h-5 w-5" />,
      name: 'Instagram',
      url: 'https://www.instagram.com/sofia.socialbae'
    },
    {
      icon: <FiFacebook className="h-5 w-5" />,
      name: 'Facebook',
      url: 'https://www.facebook.com/sofiang2407'
    },
    {
      icon: <SiTiktok className="h-5 w-5" />,
      name: 'TikTok',
      url: 'https://www.tiktok.com/@sofia.bossbae'
    }
    // {
    //   icon: <FiGithub className="h-5 w-5" />,
    //   name: 'GitHub',
    //   url: 'https://github.com'
    // },
    // {
    //   icon: <FiLinkedin className="h-5 w-5" />,
    //   name: 'LinkedIn',
    //   url: 'https://linkedin.com'
    // }
  ];

  // Add new state for chat functionality
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm an AI assistant. Will provide you with a free strategy session. Please provide your business name and email to begin.", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to scroll to bottom of chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Effect to scroll to bottom when messages change
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // Function to handle user message and generate response
  const handleSendMessage = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Show typing indicator
    setIsTyping(true);
    const input = inputMessage.toLowerCase();
    const response = await processCommand(input);
    setMessages(prev => [...prev, { text: response, isBot: true }]);
    setIsTyping(false);

  };

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[#1a0b2e]">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#7928CA] rounded-full filter blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#FF0080] rounded-full filter blur-[120px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0070F3] rounded-full filter blur-[150px] opacity-30" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#2E1065]/90 via-[#4C1D95]/80 to-[#5B21B6]/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-sm font-medium mb-4">Contact Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">Ready for More Clients? Let's Get Started!</h2>
          <p className="text-lg text-gray-200">
            Let's Skyrocket Your Success—Grab a Free Strategy Session!
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <motion.div
            className="md:col-span-2 bg-black/20 backdrop-blur-lg p-8 rounded-xl overflow-hidden shadow-xl border border-white/10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h3
              className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Contact Information
            </motion.h3>

            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                <div className="bg-white/10 p-3 rounded-full text-white">
                  <FiMail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <a href="mailto:sofiang2407@gmail.com" className="text-gray-300 hover:text-[#FF69B4] transition-colors">sofiang2407@gmail.com</a>
                </div>
              </motion.div>

              <motion.div className="flex items-start space-x-4" variants={itemVariants}>
                <div className="bg-white/10 p-3 rounded-full text-white">
                  <FiMapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Remote Office</h4>
                  <p className="text-gray-300">Hawthorn, Australia, VIC, 3123</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="mt-12 space-y-4" variants={itemVariants}>
              <h4 className="font-medium text-white mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:shadow-sm transition-all"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="mt-10 bg-gradient-to-r from-[#FF69B4] to-[#FFD700] p-6 rounded-lg text-white"
              variants={itemVariants}
            >
              <h4 className="font-bold text-lg mb-3">Let's Chat!</h4>
              <p className="mb-4 text-white/90">Want More Clients? Let's Make It Happen – Schedule a Call Today.</p>
              <a
                href="https://calendly.com/sofiang2407/30min"
                className="inline-flex items-center bg-white text-[#5B21B6] font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Talk 2 me
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:col-span-3 bg-black/20 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden border border-white/10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="p-6 border-b border-white/10"
              variants={itemVariants}
            >
              <h3 className="text-2xl font-bold flex items-center bg-gradient-to-r from-[#FF69B4] to-[#FFD700] bg-clip-text text-transparent">
                <span className="h-3 w-3 rounded-full bg-green-400 mr-3 animate-pulse"></span>
                AI Assistant
              </h3>
              <p className="text-gray-300 text-sm mt-1">Tell me how can we help your business</p>
            </motion.div>

            <motion.div
              className="h-96 overflow-y-auto p-6 bg-black/10 backdrop-blur-sm"
              variants={itemVariants}
            >
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.isBot
                        ? 'bg-white/10 text-white rounded-tl-none'
                        : 'bg-gradient-to-r from-[#FF69B4] to-[#FFD700] text-white rounded-tr-none'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>

            <motion.div
              className="p-4 border-t border-white/10"
              variants={itemVariants}
            >
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-white/10 text-white rounded-l-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#FF69B4]"
                  placeholder="Type your message here..."
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF69B4] to-[#FFD700] hover:opacity-90 text-white p-3 rounded-r-lg transition-colors"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2 text-center">
                For detailed inquiries, consider booking a discovery call
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;