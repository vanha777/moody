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
  title: 'SocialPro - Digital Marketing & Social Media Agency',
  description: 'Transform your brand with our expert social media marketing solutions.',
  openGraph: {
    title: 'SocialPro - Digital Marketing & Social Media Agency',
    description: 'Transform your brand with our expert social media marketing solutions.',
    url: 'https://www.socialpro.dev/',
    images: [
      {
        url: 'https://tzqzzuafkobkhygtccse.supabase.co/storage/v1/object/public/biz_touch/banner.png',
        alt: 'SocialPro Digital Marketing Agency',
      },
    ],
  },
  icons: {
    icon: '/logo.png',
    // You can also specify different sizes
    apple: [
      { url: '/logo.png' },
      { url: '/apple_pic.png', sizes: '180x180' }
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
        <meta name="title" content="SocialPro - Digital Marketing & Social Media Agency" />
        <meta name="description" content="Transform your brand with our expert social media marketing solutions." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://creativemood.vercel.app" />
        <meta property="og:title" content="SocialPro - Digital Marketing & Social Media Agency" />
        <meta property="og:description" content="Transform your brand with our expert social media marketing solutions." />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta property="og:image:alt" content="SocialPro - Your Partner in Digital Growth" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://creativemood.vercel.app" />
        <meta name="twitter:title" content="SocialPro - Digital Marketing & Social Media Agency" />
        <meta name="twitter:description" content="Transform your brand with our expert social media marketing solutions." />
        <meta name="twitter:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta name="twitter:image:alt" content="SocialPro - Your Partner in Digital Growth" />
        <meta name="twitter:site" content="@socialpro" />
        <meta name="twitter:creator" content="@socialpro" />

        {/* Telegram */}
        <meta property="og:title" content="SocialPro - Digital Marketing & Social Media Agency" />
        <meta property="og:description" content="Transform your brand with our expert social media marketing solutions." />
        <meta property="og:image" content="https://vbfejmafjqgcfrzxewcd.supabase.co/storage/v1/object/public/general//Black_Simple_Creative_Agency_Logo-removebg-preview.png" />
        <meta property="og:url" content="https://creativemood.vercel.app" />

        {/* Discord */}
        <meta property="og:title" content="SocialPro - Digital Marketing & Social Media Agency" />
        <meta property="og:description" content="Transform your brand with our expert social media marketing solutions." />
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