'use client';

import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { useState, useRef } from 'react';
import processCommand from '@/app/ultilities/mod';

const Contact = () => {
  const [messages, setMessages] = useState([
    { text: "Hey there! 👋 I'd love to help with any questions about our nail services and products. Just drop your name and email to get started, then ask away! What can I help you with today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    setIsTyping(true);
    const input = inputMessage.toLowerCase();
    const response = await processCommand(input);
    setMessages(prev => [...prev, { text: response, isBot: true }]);
    setIsTyping(false);
  };

  return (
    // <section id="contact" className="relative overflow-hidden py-24 bg-white">
      <section id="contact" className="relative overflow-hidden py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Have Questions?
            <span className="block h-1 w-24 bg-[#D1B882] mx-auto mt-4"></span>
          </h2>
          <p className="text-lg text-black/80">
            Our virtual assistant is here to help you 24/7
          </p>
        </div>

        <motion.div
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-[#D1B882]/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 border-b border-[#D1B882]/30 bg-gradient-to-r from-[#D1B882]/10 to-white">
            <h3 className="text-xl font-bold flex items-center text-black">
              <span className="h-3 w-3 rounded-full bg-[#D1B882] mr-3 animate-pulse"></span>
              Service Assistant
            </h3>
            <p className="text-black/60 text-sm mt-1">Ask me anything about our services and products</p>
          </div>

          <div className="h-[400px] overflow-y-auto p-6 bg-gradient-to-b from-[#D1B882]/10 to-white">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.isBot
                      ? 'bg-white text-black shadow-sm rounded-tl-none border border-[#D1B882]/20'
                      : 'bg-[#D1B882] text-white rounded-tr-none'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-black rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-[#D1B882] animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-[#D1B882] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 rounded-full bg-[#D1B882] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-[#D1B882]/30 bg-gradient-to-r from-white to-[#D1B882]/10">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-white text-black rounded-l-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#D1B882] border border-[#D1B882]/30"
                placeholder="Ask about our services..."
              />
              <button
                type="submit"
                className="bg-[#D1B882] hover:bg-[#D1B882]/90 text-white p-3 rounded-r-full transition-all duration-300"
              >
                <FiSend className="h-5 w-5" />
              </button>
            </form>
            <p className="text-xs text-black/60 mt-2 text-center">
              Need more specific help? <a href="https://calendly.com/sofiang2407/30min" className="text-[#D1B882] hover:underline font-medium">Book an appointment</a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;