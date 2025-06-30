import { Header } from "@/components/landing_page/header"
import { HeroSection } from "@/components/landing_page/hero-section"
import { FeaturesSection } from "@/components/landing_page/features-section"
import { CTASection } from "@/components/landing_page/cta-section"
import { FooterSection } from "@/components/landing_page/footer-section"
import { HashNavigationHandler } from "@/components/landing_page/hash-navigation-handler"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HashNavigationHandler />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
