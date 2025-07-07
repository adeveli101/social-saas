import { Header } from "@/components/shared/header"
import { HeroSection } from "@/components/landing_page/hero-section"
import { FeaturesSection } from "@/components/landing_page/features-section"
import { CTASection } from "@/components/landing_page/cta-section"
import { FooterSection } from "@/components/landing_page/footer-section"
import { HashNavigationHandler } from "@/components/landing_page/hash-navigation-handler"
import { PageContainer } from "@/components/shared/page-container"

export default function HomePage() {
  return (
    <PageContainer>
      <HashNavigationHandler />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </PageContainer>
  )
}
