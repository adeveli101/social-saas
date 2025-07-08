'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap } from 'lucide-react'
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from '@/lib/plans'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface PricingCardsProps {
  onSelectPlan?: (plan: SubscriptionPlan) => void
  currentPlan?: string
}

export function PricingCards({ onSelectPlan, currentPlan }: PricingCardsProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [loading, setLoading] = useState<string | null>(null)
  const { user } = useUser()
  const router = useRouter()

  const getPlanPrice = (plan: SubscriptionPlan) => {
    if (plan.price === 0) return 'Free'
    
    const price = billingInterval === 'year' 
      ? Math.round(plan.price * 10) // %17 indirim
      : plan.price
    
    return `$${price}${billingInterval === 'year' ? '/year' : '/month'}`
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="h-5 w-5 text-[var(--primary)]" />
      case 'pro':
        return <Crown className="h-5 w-5 text-[var(--primary)]" />
      case 'business':
        return <Crown className="h-5 w-5 text-[var(--primary)]" />
      default:
        return null
    }
  }

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    if (plan.id === 'free') {
      // Free plan seçildiğinde
      if (onSelectPlan) {
        onSelectPlan(plan)
      }
      return
    }

    setLoading(plan.id)

    try {
      // Plan seçimi işlemi
      if (onSelectPlan) {
        onSelectPlan(plan)
      } else {
        // Varsayılan plan seçimi işlemi
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan: plan.id }),
        })

        if (response.ok) {
          // Başarılı plan güncellemesi
          router.refresh()
        } else {
          throw new Error('Failed to update plan')
        }
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
      // Hata durumunda kullanıcıya bilgi ver
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4 bg-[var(--muted)] rounded-lg p-1">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingInterval === 'month'
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingInterval === 'year'
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id
          const isPopular = plan.id === 'pro'
          const isLoading = loading === plan.id
          
          return (
            <Card 
              key={plan.id}
              className={`relative transition-all duration-200 hover:scale-105 bg-[var(--card)] border-[var(--border)] ${
                isPopular 
                  ? 'border-[var(--primary)] bg-gradient-to-b from-[var(--primary)]/10 to-transparent' 
                  : 'border-[var(--border)]'
              } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {plan.id === 'free' ? <Zap className="h-5 w-5 text-[var(--primary)]" /> : <Crown className="h-5 w-5 text-[var(--primary)]" />}
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--foreground)]">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-[var(--primary)]">
                  {getPlanPrice(plan)}
                </div>
                {plan.price > 0 && billingInterval === 'year' && (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    ${plan.price}/month when billed monthly
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--muted-foreground)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full ${
                    isCurrentPlan
                      ? 'bg-green-600 hover:bg-green-700'
                      : isPopular
                      ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 hover:from-[var(--primary)]/90 hover:to-[var(--primary)]/70'
                      : 'bg-[var(--accent)] hover:bg-[var(--accent)]/80'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : plan.price === 0 ? (
                    'Get Started'
                  ) : (
                    'Upgrade'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 