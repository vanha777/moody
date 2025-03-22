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
  title: 'Glaze - Nail Salon',
  description: 'More than just nails, it\'s about style, confidence, and self-care. ✨ Get flawless designs with premium care.',
  openGraph: {
    title: 'Glaze - Nail Salon',
    description: 'More than just nails, it\'s about style, confidence, and self-care. ✨ Get flawless designs with premium care.',
    url: 'https://www.glaze.com/',
    images: [
      {
        url: 'https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png',
        alt: 'Glaze Nail Salon',
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
        <meta name="title" content="Glaze - Nail Salon" />
        <meta name="description" content="More than just nails, it\'s about style, confidence, and self-care. ✨ Get flawless designs with premium care." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://creativemood.vercel.app" />
        <meta property="og:title" content="Glaze - Nail Salon" />
        <meta property="og:description" content="More than just nails, it\'s about style, confidence, and self-care. ✨ Get flawless designs with premium care." />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta property="og:image:alt" content="Glaze - Nail Salon" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://glaze.com/" />
        <meta name="twitter:title" content="Glaze - Nail Salon" />
        <meta name="twitter:description" content="More than just nails, it\'s about style, confidence, and self-care. ✨ Get flawless designs with premium care." />
        <meta name="twitter:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta name="twitter:image:alt" content="Glaze - Nail Salon" />
        <meta name="twitter:site" content="@glaze" />
        <meta name="twitter:creator" content="@glaze" />

        {/* Telegram */}
        <meta property="og:title" content="Glaze - Nail Salon" />
        <meta property="og:description" content="More than just nails, it\'s about style, confidence, and self-care. ✨ Get flawless designs with premium care." />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta property="og:url" content="https://glaze.com/" />

        {/* Discord */}
        <meta property="og:title" content="Glaze - Nail Salon" />
        <meta property="og:description" content="More than just nails, it\'s about style, confidence, and self-care. ✨ Get flawless designs with premium care." />
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