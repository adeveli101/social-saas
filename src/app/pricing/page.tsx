import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { PricingCards } from '@/components/paywall/pricing-cards'
import { getUserCurrentPlan } from '@/lib/clerk'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Pricing - AI Carousel Studio',
  description: 'Find the Right Visiona Plan for You. Create stunning AI-powered carousels with flexible pricing.',
}

export default async function PricingPage() {
  const { userId } = await auth()
  let currentPlan = 'starter'

  if (userId) {
    try {
      const supabase = await createClient()
      currentPlan = await getUserCurrentPlan(userId, supabase)
    } catch (error) {
      console.error('Error getting user plan:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="relative container mx-auto px-4 py-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="text-gray-50">Choose Your </span>
            <span className="text-gradient-animated">Plan</span>
          </h1>
          
          <p className="text-sm text-gray-200 max-w-md mx-auto mb-4">
            Simple, transparent pricing for everyone.
          </p>

          {/* Value Proposition */}
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-200">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
                <span className="text-emerald-300 text-[8px]">✓</span>
              </div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
                <span className="text-blue-300 text-[8px]">⚡</span>
              </div>
              <span>Instant activation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center">
                <span className="text-purple-300 text-[8px]">🎨</span>
              </div>
              <span>Premium styles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-2 border-b border-white/10">
        <PricingCards currentPlan={currentPlan} />
      </div>

      {/* Simple Footer CTA */}
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-200 text-sm mb-3">
          Questions? We&apos;re here to help.
        </p>
        <a 
          href="mailto:support@socialsaas.app" 
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
} 