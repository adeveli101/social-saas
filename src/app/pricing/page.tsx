import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { PricingCards } from '@/components/paywall/pricing-cards'
import { Header } from '@/components/landing_page/header'
import { getUserCurrentPlan } from '@/lib/clerk'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Pricing - Social SaaS',
  description: 'Choose the perfect plan for your social media management needs',
}

export default async function PricingPage() {
  const { userId } = await auth()
  let currentPlan = 'free'

  if (userId) {
    try {
      const cookieStore = cookies()
      const supabase = await createClient(cookieStore)
      currentPlan = await getUserCurrentPlan(userId, supabase)
    } catch (error) {
      console.error('Error getting user plan:', error)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the perfect plan for your social media management needs. 
            Start free and upgrade as you grow.
          </p>
        </div>
        
        <PricingCards currentPlan={currentPlan} />
        
        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Can I change plans anytime?</h3>
              <p className="text-slate-400">
                Yes! You can upgrade or downgrade your plan at any time. 
                Changes take effect immediately.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Is there a free trial?</h3>
              <p className="text-slate-400">
                We offer a 14-day free trial on all paid plans. 
                No credit card required to start.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What payment methods do you accept?</h3>
              <p className="text-slate-400">
                We accept all major credit cards, PayPal, and bank transfers 
                for annual plans.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Can I cancel anytime?</h3>
              <p className="text-slate-400">
                Absolutely. You can cancel your subscription at any time 
                with no cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 