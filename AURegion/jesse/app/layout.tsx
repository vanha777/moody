import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Head from 'next/head';
import { Analytics } from "@vercel/analytics/react"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { AppProvider } from './utils/AppContext';
config.autoAddCss = false
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jess Glow - Eyebrows & Lashes Salon in Morley',
  description: 'At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued',
  openGraph: {
    title: 'Jess Glow - Eyebrows & Lashes Salon in Morley',
    description: 'At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued',
    url: 'https://www.jessglow.com/',
    images: [
      {
        url: 'https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png',
        alt: 'Jess Glow - Eyebrows & Lashes Salon in Morley',
      },
    ],
  },
  icons: {
    icon: '/logo.png',
    // You can also specify different sizes
    apple: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '180x180' }
    ],
    shortcut: '/favicon.ico'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
      <Head>
        {/* General Meta Tags */}
        <meta name="title" content="Jess Glow - Eyebrows & Lashes Salon in Morley" />
        <meta name="description" content="At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jessglow.vercel.app" />
        <meta property="og:title" content="Jess Glow - Eyebrows & Lashes Salon in Morley" />
        <meta property="og:description" content="At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued" />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta property="og:image:alt" content="Jess Glow - Eyebrows & Lashes Salon in Morley" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://jessglow.vercel.app/" />
        <meta name="twitter:title" content="Jess Glow - Eyebrows & Lashes Salon in Morley" />
        <meta name="twitter:description" content="At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued" />
        <meta name="twitter:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta name="twitter:image:alt" content="Jess Glow - Eyebrows & Lashes Salon in Morley" />
        <meta name="twitter:site" content="@jessglow" />
        <meta name="twitter:creator" content="@jessglow" />

        {/* Telegram */}
        <meta property="og:title" content="Jess Glow - Eyebrows & Lashes Salon in Morley" />
        <meta property="og:description" content="At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued" />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta property="og:url" content="https://jessglow.vercel.app/" />

        {/* Discord */}
        <meta property="og:title" content="Jess Glow - Eyebrows & Lashes Salon in Morley" />
        <meta property="og:description" content="At Jess Glow, we focus on the little details that make a difference, ensuring every visit leaves you feeling refreshed, confident, and truly valued" />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta property="og:type" content="website" />
      </Head>
      <body suppressHydrationWarning={true} className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
        <Analytics />
      </body>
    </html>
  )
} 