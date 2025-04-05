'use client'

import { useState, useEffect, Suspense } from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import PricingHero from './components/pricing'

export default function Pricing() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="bg-transparent min-h-screen relative">
        <NavBar />
        <div className="flex flex-col">
          <PricingHero />
        </div>
        <Footer />
      </main>
    </Suspense>
  )
}