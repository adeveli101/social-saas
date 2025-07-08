import { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { PricingCards } from '@/components/paywall/pricing-cards'
import { getUserCurrentPlan } from '@/lib/clerk'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { PageContainer } from '@/components/shared/page-container'

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
      const supabase = await createClient()
      currentPlan = await getUserCurrentPlan(userId, supabase)
    } catch (error) {
      console.error('Error getting user plan:', error)
    }
  }

  return (
    <PageContainer>
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold heading-gradient heading mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your social media management needs. 
            Start free and upgrade as you grow.
          </p>
        </div>
        
        <PricingCards currentPlan={currentPlan} />
        
        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 heading-gradient heading">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg">
              <h3 className="text-lg font-semibold text-foreground">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. 
                Changes take effect immediately.
              </p>
            </div>
            <div className="space-y-4 p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg">
              <h3 className="text-lg font-semibold text-foreground">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                We offer a 14-day free trial on all paid plans. 
                No credit card required to start.
              </p>
            </div>
            <div className="space-y-4 p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg">
              <h3 className="text-lg font-semibold text-foreground">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers 
                for annual plans.
              </p>
            </div>
            <div className="space-y-4 p-6 bg-[var(--card)] border border-[var(--border)] rounded-lg">
              <h3 className="text-lg font-semibold text-foreground">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Absolutely. You can cancel your subscription at any time 
                with no cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageContainer>
  )
} 