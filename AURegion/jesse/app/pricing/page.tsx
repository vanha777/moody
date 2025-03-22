'use client'

import { useState, useEffect, Suspense } from 'react'
import Satements from '@/components/statements'
import Hero2 from '@/components/Hero2'
import Demo from '@/components/Demo'
import NavBar from '@/components/NavBar'
import Starters from '@/components/Starters'
import Footer from '@/components/Footer'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/contact'
import Hero3 from '@/components/Hero3'
import Product from '@/components/product'
import Social from '@/components/social'
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
          {/* <Hero2 /> */}
          {/* <Demo /> */}
          {/* <Satements /> */}
          {/* <Testimonials /> */}
          <PricingHero />
          {/* <Product /> */}
          {/* <Contact  />
          <Social /> */}
          {/* <Starters /> */}
        </div>
        <Footer />
      </main>
    </Suspense>
  )
}