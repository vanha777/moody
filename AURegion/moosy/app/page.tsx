'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/business')
  }, [router])

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-gray-800">Redirecting to business page...</div>
    </div>
  )
}