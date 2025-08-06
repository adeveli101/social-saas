'use client'

import { useEffect, useState } from 'react'
import { FooterSection } from '@/components/landing_page/footer-section'

export function FooterWrapper() {
  const [shouldHideFooter, setShouldHideFooter] = useState(false)

  useEffect(() => {
    // Check if any parent element has data-hide-footer attribute
    const checkForHideFooter = () => {
      const elements = document.querySelectorAll('[data-hide-footer="true"]')
      setShouldHideFooter(elements.length > 0)
    }

    // Check immediately
    checkForHideFooter()

    // Set up a mutation observer to watch for changes
    const observer = new MutationObserver(checkForHideFooter)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-hide-footer']
    })

    return () => observer.disconnect()
  }, [])

  if (shouldHideFooter) {
    return null
  }

  return <FooterSection />
} 