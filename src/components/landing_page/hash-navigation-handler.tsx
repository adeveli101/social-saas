'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function HashNavigationHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // URL'deki hash'i kontrol et
    const hash = window.location.hash.replace('#', '')
    
    if (hash) {
      // Sayfa yüklendikten sonra smooth scroll yap
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [searchParams])

  return null
} 