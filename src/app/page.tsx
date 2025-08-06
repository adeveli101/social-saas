import { Suspense } from "react"
import { HeroSection } from "@/components/landing_page/hero-section"
import { FeaturesSection } from "@/components/landing_page/features-section"
import { CTASection } from "@/components/landing_page/cta-section"
import { HashNavigationHandler } from "@/components/landing_page/hash-navigation-handler"

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <HashNavigationHandler />
      </Suspense>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
